var express = require('express');
var app = express();

app.get('/hello/:name', function(req, res) {
  res.send('hola! ' + req.params.name);
});

module.exports = app;