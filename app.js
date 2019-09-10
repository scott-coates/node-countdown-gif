'use strict';

// server
const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression')

const tmpDir = __dirname + '/tmp/';
const publicDir = __dirname + '/public/';

// canvas generator
const CountdownGenerator = require('./countdown-generator');

// https://github.com/expressjs/compression/issues/82
app.use(
  compression({
    filter: function shouldCompress(req, res) {
      if (/^image\//.test(res.getHeader("Content-Type"))) {
        // compress any image format
        return true;
      }

      // fallback to standard filter function
      return compression.filter(req, res);
    }
  })
);

app.use(express.static(publicDir));
app.use(express.static(tmpDir));

// root
app.get('/', function (req, res) {
    res.sendFile(publicDir + 'index.html');
});

// generate and download the gif
app.get('/generate', function (req, res) {
    let {time, timezone, color, bg, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    const key = req.query.key || 'default'; 
    const width = "400", height =  "80";

    CountdownGenerator.init(time, timezone, width, height, color, bg, key, frames, () => {
        let filePath = tmpDir + key + '.gif';
        res.download(filePath);
    });
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    let {end_date, end_time, timezone, color, bg, frames} = req.query;

    if(!end_date){
        throw Error('end_date parameter is required.');
    }
    
    timezone = timezone || 'UTC';
    const key = req.query.key || 'default'; 
    const width = "400", height =  "80";

    CountdownGenerator.init(end_date, end_time, timezone, width, height, color, bg, key, frames, () => {
        let filePath = tmpDir + key + '.gif';
        res.sendFile(filePath);
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
