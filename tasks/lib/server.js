/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt, target) {
  if (!process._servers) {
    process._servers = {};
  }

  var backup  = null;
  var done    = null;
  var server  = process._servers[target]; // Store server between live reloads to close/restart express

  var finished = function() {
    if (done) {
      done();

      done = null;
    }
  };

  return {
    start: function start(options) {
      var i, len, nodejs_args;

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
        if(options.cmd === 'coffee') {
          options.args.unshift('--nodejs');
        }
      }

      nodejs_args = options.nodejs_args;

      // Set any forwarded args to the node executable using the --nodejs option.
      // E.g. --debug-brk, --expose-gc.
      if (nodejs_args && nodejs_args.length) {
        for (i = 0, len = nodejs_args.length; i < len; i++) {
          options.args.unshift('--nodejs', nodejs_args[i]);
        }
      }

      if (options.background) {
        server = process._servers[target] = grunt.util.spawn({
          cmd:      options.cmd,
          args:     options.args,
          env:      process.env,
          fallback: options.fallback
        }, finished);

        if (options.delay) {
          setTimeout(finished, options.delay);
        }

        if (options.output) {
          server.stdout.on('data', function(data) {
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
        server = process._servers[target] = require(options.script);
      }

      process.on('exit', finished);
      process.on('exit', this.stop);
    },

    stop: function stop() {
      if (server && server.kill) {
        grunt.log.writeln('Stopping'.red + ' Express server');

        server.kill('SIGTERM');
        process.removeListener('exit', finished);
        process.removeListener('exit', stop);
        server = process._servers[target] = null;
      }

      // Restore original process.env
      if (backup) {
        process.env = JSON.parse(JSON.stringify(backup));
      }

      finished();
    }
  };
};
