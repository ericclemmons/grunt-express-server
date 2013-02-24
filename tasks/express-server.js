/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var path    = require('path');
var server  = null; // Store server between live reloads to close/restart express

module.exports = function(grunt) {

  grunt.registerTask('express-server', 'Start an express web server', function() {

    var done = this.async();

    if (server) {
      console.log("Killing existing Express server");

      server.kill('SIGTERM');
      server = null;
    }

    server = grunt.util.spawn({
      cmd:      process.argv[0],
      args:     [ grunt.config.get('server.script') ],
      fallback: function() {
        // Prevent EADDRINUSE from breaking Grunt
      }
    }, function(err, result, code) {
      // Nothing to do, but callback has to exist
    });

    server.stdout.on('data', function() {
      if (done) {
        done();
      }

      done = null;
    });

    server.stdout.pipe(process.stdout);
    server.stderr.pipe(process.stdout);
  });

};
