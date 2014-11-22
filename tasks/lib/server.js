/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';
var spawn = require('child_process').spawn;

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

      if (options.cmd === 'coffee') {
        grunt.log.writeln('You are using cmd: coffee'.red);
        grunt.log.writeln('coffee does not allow a restart of the server'.red);
        grunt.log.writeln('use opts: ["path/to/your/coffee"] instead'.red);
      }

      // Set debug mode for node-inspector
      // Based on https://github.com/joyent/node/blob/master/src/node.cc#L2903
      if (options.debug === true) {
        options.opts.unshift('--debug');
      } else if (!isNaN(parseInt(options.debug, 10))) {
        options.opts.unshift('--debug=' + options.debug);
      } else if (options.breakOnFirstLine === true) {
        options.opts.unshift('--debug-brk');
      } else if (!isNaN(parseInt(options.breakOnFirstLine, 10))) {
        options.opts.unshift('--debug-brk=' + options.breakOnFirstLine);
      }

      if ((options.debug || options.breakOnFirstLine) && options.cmd === 'coffee') {
        options.opts.unshift('--nodejs');
      }

      if (options.background) {
        var errtype = process.stderr;
        if(options.logs && options.logs.err) {
          errtype = 'pipe';
        }
        server = process._servers[target] = spawn(
          options.cmd,
          options.opts.concat(options.args),
          {
            env:      process.env,
            stdio: ['ignore', 'pipe', errtype]
          }
        );

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
        var out = process.stdout;
        if(options.logs) {
          var fs = require('fs'), path = require('path');
          if(options.logs.out) {
            out = fs.createWriteStream(path.resolve(options.logs.out), {flags: 'a'});
          }
          if(options.logs.err && errtype === 'pipe') {
            server.stderr.pipe(fs.createWriteStream(path.resolve(options.logs.err), {flags: 'a'}));
          }
        }
        server.stdout.pipe(out);
        server.on('close',this.stop);
      } else {
        // Server is ran in current process
        server = process._servers[target] = require(options.script);
      }
      process.on('exit', this.stop);
    },

    stop: function stop() {
      if (server && server.kill) {
        grunt.log.writeln('Stopping'.red + ' Express server');
        server.removeAllListeners('close');
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
