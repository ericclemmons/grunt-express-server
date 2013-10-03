/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var done    = null;
  var server  = null; // Store server between live reloads to close/restart express
  var backup  = null;

  var finished = function() {
    if (done) {
      done();

      done = null;
    }
  };

  return {
    start: function(options) {
      if (server) {
        this.stop();

        if (grunt.task.current.flags.stop) {
          finished();

          return;
        }
      }

      backup = JSON.parse(JSON.stringify(process.env)); // Clone process.env

      // For some weird reason, on Windows the process.env stringify produces a "Path"
      // member instead of a "PATH" member, and grunt chokes when it can't find PATH.
      if (!backup.PATH) {
        if (backup.Path) {
          backup.PATH = backup.Path;
          delete backup.Path;
        }
      }

      grunt.log.writeln('Starting '.cyan + (options.background ? 'background' : 'foreground') + ' Express server');

      done = grunt.task.current.async();

      // Set PORT for new processes
      process.env.PORT = options.port;

      // Set NODE_ENV for new processes
      if (options.node_env) {
        process.env.NODE_ENV = options.node_env;
      }

      // Set debug mode for node-inspector
      if(options.debug) {
        options.args.unshift('--debug');
      }

      if (options.background) {
        server = grunt.util.spawn({
          cmd:      options.cmd,
          args:     options.args,
          env:      process.env,
          fallback: options.fallback
        }, options.error);

        if (options.delay) {
          setTimeout(finished, options.delay);
        }

        if (options.output) {
          server.stdout.on('data', function(data){
            var message = "" + data;
            var regex = new RegExp(options.output, "gi");
            if (message.match(regex)) {
              finished();
            }
          });
        }

        server.stdout.pipe(process.stdout);
        server.stderr.pipe(process.stderr);
      } else {
        // Server is ran in current process
        server = require(options.script);
      }

      process.on('exit', finished);
      process.on('exit', this.stop);
    },

    stop: function() {
      if (server && server.kill) {
        grunt.log.writeln('Stopping'.red + ' Express server');

        server.kill('SIGTERM');
        process.removeAllListeners();
        server = null;

        // Restore original process.env
        process.env = JSON.parse(JSON.stringify(backup));
      }

      finished();
    }
  };
};
