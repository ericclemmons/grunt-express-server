/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  var server = require('./lib/server')(grunt);

  grunt.registerMultiTask('express', 'Start an express web server', function() {
    var options = this.options({
      cmd:           process.argv[0],
      args:          [ ],
      node_env:      undefined,
      background:    true,
      error:         function(err, result, code) { /* Callback has to exist */ },
      fallback:      function() { /* Prevent EADDRINUSE from breaking Grunt */ },
      port:          3000,
      delay:         0,
      output:        ".+",
      debug:         false
    });

    options.script = path.resolve(options.script);

    options.args.unshift(options.script);

    if (!grunt.file.exists(options.script)) {
      grunt.log.error('Could not find server script: ' + options.script);

      return false;
    }

    server.start(options);
  });
};
