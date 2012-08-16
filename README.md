# zencoder-js

## Update node to latest

http://nodejs.org/#download

## Install

<pre>
npm install zc
</pre>

## Authors

  - Adam Christian ([admc](http://github.com/admc))
  
## License

  * License - Apache 2: http://www.apache.org/licenses/LICENSE-2.0

## Usage

<pre>
var zc = require('zc');

var obj = {
  api_key: "your api key"
  , input: "url to the video"
  , label: "what do you wanna call the result file (minus the extension)"
  , dest: "ftp://un:pwd@domain.blah.com"
  , codecs: {webm: {}}
};

var session = zc.zc(obj);

session.on('update', function(info){
  console.log('\x1b[36mupdate\x1b[0m: '+ info);
});

session.on('finished', function(info){
  console.log(' > \x1b[33mfinished\x1b[0m: '+ info);
});

//takes err, cb
session.init(
  function(o) {
    console.log('\x1b[36m%s\x1b[0m', 'Error: ', o);
  },
  function(o) {
    console.log('\x1b[36m%s\x1b[0m', 'Init: ', o);
  });
</pre>


