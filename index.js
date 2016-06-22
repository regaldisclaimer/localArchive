var path = require('path');
var fs   = require('fs');
var ytdl = require('youtube-dl');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.use(express.static('public'));
server.listen(80, '0.0.0.0');

function playlist(url) {

  'use strict';
  var video = ytdl(url);

  video.on('error', function error(err) {
    console.log('error 2:', err);
  });

  var size = 0;
  video.on('info', function(info) {
    size = info.size;
    var output = path.join(__dirname + '/', size + '.mp4');
    video.pipe(fs.createWriteStream(output));
  });

  var pos = 0;
  video.on('data', function data(chunk) {
    pos += chunk.length;
    // `size` should not be 0 here.
    if (size) {
      var percent = (pos / size * 100).toFixed(2);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(percent + '%');
    }
  });

  video.on('next', playlist);
  console.log('done');
}

app.get('/', function(req, res) {
  res.send('Processing Request...');
  var url = req.query.q;
  playlist(url);
});
