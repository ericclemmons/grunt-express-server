/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var server = null; // Store server between live reloads to close/restart express

  return {
    start: function(options) {
      if (server) {
        this.stop();
      };

      grunt.log.writeln('Starting '.cyan + (options.background ? 'background' : 'foreground') + ' Express server');

      // Set PORT for new processes
      process.env.PORT = options.port;

      if (options.background) {
        var done = grunt.task.current.async();


        server = grunt.util.spawn({
          cmd:      process.argv[0],
          args:     options.args,
          fallback: options.fallback
        }, options.error);

        server.stdout.on('data', function() {
          if (done) {
            done();
          }

          done = null;
        });

        server.stdout.pipe(process.stdout);
        server.stderr.pipe(process.stderr);
      } else {
        // Server is ran in current process
        server = require(options.script);
      }

      process.on('exit', this.stop);
    },

    stop: function() {
      if (server) {
        grunt.log.writeln('Stopping'.red + ' Express server');

        server.kill('SIGTERM');
        server = null;
      };
    }
  };
};
