"use strict";

var express = require('express');
var app     = module.exports = express();
var args = process.argv;

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.static(__dirname + '/../test/fixtures'));
});

app.configure('production', function() {
  app.get('/production', function(req, res) {
    res.send("Production Howdy!");
  });
});

// Setup simple echo for each additional argument passed for testing
args.slice(2).forEach(function(arg) {
  app.get('/' + arg, function(req, res) {
    res.send('Howdy ' + arg + '!');
  });
});
