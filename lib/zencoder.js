var request = require('request')
  , EventEmitter = require('events').EventEmitter
  , h = {accept:'application/json', 'content-type':'application/json'};

//opt requires:
/*
  {
    api_key: str
    input: url -str
    label : str
    dest: url of where to put it (file name will be appended with the right ending) 
    codecs: {webm: {}, ogg: {}, mp4: {}} //ovveride options from https://app.zencoder.com/docs
  }
*/

var zc = module.exports = function(opt) {
  this.job = {};
  this.defaults = { 
    ogg:  {
      "video_codec": "theora",
      "quality": 3,
      "speed": 1,
      "width": 640,
      "height": 360,
      "audio_codec": "vorbis",
      "audio_quality": 3,
      "max_frame_rate": 24
    }
    , webm: {
      "video_codec": "vp8",
      "quality": 3,
      "speed": 1,
      "width": 640,
      "height": 360,
      "audio_codec": "vorbis",
      "audio_quality": 3,
      "max_frame_rate": 24
    }
    , mp4: {
      "video_codec": "h264",
      "quality": 3,
      "speed": 1,
      "width": 640,
      "height": 360,
      "audio_codec": "aac",
      "audio_quality": 3,
      "max_frame_rate": 24
    }
  };

  this.options = {
    "api_key": opt.api_key,
    "input": opt.input,
    "output": []
  }

  for (codec in opt.codecs) {
    if (codec in this.defaults) {
      var codecObj = this.defaults[codec];
      var ovObj = opt.codecs[codec];

      for (k in ovObj) {
        codecObj[k] = ovObj[k];
      }

      codecObj.filename = opt.label + "." +codec;
      codecObj.base_url = opt.dest;
      codecObj.label = opt.label;

      this.options.output.push(codecObj); 
    }
  }
};

zc.prototype = new EventEmitter();

zc.prototype.init = function(err, cb) {
  var _this = this;

  request({uri:'https://app.zencoder.com/api/jobs'
          , method:'POST'
          , body:JSON.stringify(_this.options)
          , headers:h}, function (error, response, body) {

    if (!error && response.statusCode == 201) { 
      _this.job = JSON.parse(body);
      var iv = setInterval(function() {
        var url = "https://app.zencoder.com/api/v2/jobs/"+_this.job.id+"/progress.json?api_key="+_this.options.api_key;
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) { 
            var jbody = JSON.parse(body);
            if ((jbody.state == "finished") || (jbody.state == "failed")) {
              clearInterval(iv);
              _this.emit('finished',  body);
            }
            else {
              _this.emit('update',  body);
            }
          }
        });
      }, 5000);

      cb(body);
    }
    else { err(error); }
  });
}
