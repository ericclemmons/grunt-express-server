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

  var taskFinished = function() {
    if (done) {
      //grunt.log.writeln('Task finished'.green);
      done();
      done = null;
    }
  };
  var processFinished = function() { 
    //grunt.log.writeln('Process finished'.green);
    server = null;
    taskFinished();
  };

  return {
    start: function(options) {
      var self = this;
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
      serverEnv = grunt._.assign({}, process.env, {PORT: options.port});

      // Spawn the express server
      server = grunt.util.spawn({
        cmd:      (options.cmd || process.argv[0]),
        args:     options.args,
        env:      serverEnv,
        fallback: options.fallback
      }, options.error);

      // Set up signal handlers for the child (server) & parent processes
      server.once('exit', processFinished);
      process.once('SIGINT',  function(){ self.stop('SIGINT');  });
      process.once('SIGTERM', function(){ self.stop('SIGTERM'); });
      process.once('exit', this.stop);

      server.stdout.pipe(process.stdout);
      server.stderr.pipe(process.stderr);
      
      // Delay / response detection for a server running as a background process
      if (options.background) {
        if (options.delay) {
          setTimeout(taskFinished, options.delay);
        }
        if (options.output) {
          server.stdout.on('data', function(data){
            var message = "" + data;
            var regex = new RegExp(options.output, "gi");
            if (message.match(regex)) taskFinished();
          });
        }
      }
    },

    stop: function(signal) {
      if (server) {
        grunt.log.writeln('Stopping'.red + ' Express server');
        server.kill(signal? signal : 'SIGTERM');
      };
    }
  };
};
