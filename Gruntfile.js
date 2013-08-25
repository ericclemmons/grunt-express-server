/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'test/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Unit tests.
    nodeunit: {
      defaults: {
        src: 'test/defaults_test.js'
      },
      custom_cmd: {
        src: 'test/custom_cmd_test.js'
      },
      custom_args: {
        src: 'test/custom_args_test.js'
      },
      custom_port: {
        src: 'test/custom_port_test.js'
      },
      custom_node_env: {
        src: 'test/custom_node_env_test.js'
      },
      custom_delay: {
        src: 'test/custom_delay_test.js'
      },
      custom_output: {
        src: 'test/custom_output_test.js'
      },
      stoppable: {
        src: 'test/stoppable_test.js'
      }
    },

    express: {
      options: {
        script: './test/server.js',
        port: 3000
      },
      defaults: {},
      custom_cmd: {
        options: {
          script: './test/server.coffee',
          cmd: "coffee",
          output: "Express server listening on port .+"
        }
      },
      custom_args: {
        options: {
          args: [ 1, 2],
          output: "Express server listening on port .+"
        }
      },
      custom_background: {
        options: {
          background: false
        }
      },
      custom_port: {
        options: {
          port: 8080,
          output: "Express server listening on port .+"
        }
      },
      custom_node_env: {
        options: {
          node_env: "production",
          output: "Express server listening on port .+"
        }
      },
      custom_delay: {
        options: {
          delay: 1000,
          output: "This RegEx does not match anything lol"
        }
      },
      custom_output: {
        options: {
          output: "timeout"
        }
      },
      custom_delay_output: {
        options:  {
          delay: 1000,
          output: "Express server listening on port .+"
        }
      },
      stoppable: {}
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'express:defaults', 'nodeunit:defaults',
    'express:custom_cmd', 'nodeunit:custom_cmd',
    'express:custom_args', 'nodeunit:custom_args',
    'express:custom_port', 'nodeunit:custom_port',
    'express:custom_node_env', 'nodeunit:custom_node_env',
    'express:custom_delay', 'nodeunit:custom_delay',
    'express:custom_output', 'nodeunit:custom_output',
    'express:stoppable', 'express:stoppable:stop', 'nodeunit:stoppable'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
