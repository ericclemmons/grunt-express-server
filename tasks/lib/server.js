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

  var finished = function() {
    if (done) {
      done();

      done = null;
    }
  };

  return {
    start: function(options) {
      var _this = this;
      if (server) {
        this.stop();

        if (grunt.task.current.flags.stop) {
          finished();
          return;
        }
      };

      grunt.log.writeln('Starting '.cyan + (options.background ? 'background' : 'foreground') + ' Express server');

      done = grunt.task.current.async();

      // Set PORT for new processes
      process.env.PORT = options.port;
      var spawnOptions = {
        cmd:      (options.cmd || process.argv[0]),
        args:     options.args,
        env:      process.env,
        fallback: options.fallback
      };

      var doneHandler = options.background? options.error : function() {
        finished();
        options.error.apply(options, arguments);
      };

      server = grunt.util.spawn({
        cmd:      (options.cmd || process.argv[0]),
        args:     options.args,
        env:      process.env,
        fallback: options.fallback
      }, doneHandler);

      if (options.background) {
        if (options.delay) {
          setTimeout(finished, options.delay);
        }
        if (options.output) {
          server.stdout.on('data', function(data){
            var message = "" + data;
            var regex = new RegExp(options.output, "gi");
            if (message.match(regex)) finished();
          });
        }
      }
      
      server.stdout.pipe(process.stdout);
      server.stderr.pipe(process.stderr);

      process.once('SIGINT',  function(){ _this.stop('SIGINT');  });
      process.once('SIGTERM', function(){ _this.stop('SIGTERM'); });
      process.once('exit', this.stop);
    },

    stop: function(signal) {
      if (server) {
        grunt.log.writeln('Stopping'.red + ' Express server');
        server.kill(signal? signal : 'SIGTERM');
        process.removeAllListeners();
        server = null;
      };
      finished();
    }
  };
};
