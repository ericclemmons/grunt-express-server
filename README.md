[//]: #@corifeus-header

  [![Build Status](https://travis-ci.org/patrikx3/grunt-p3x-express.svg?branch=master)](https://travis-ci.org/patrikx3/grunt-p3x-express)  [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/patrikx3/grunt-p3x-express/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/grunt-p3x-express/?branch=master)  [![Code Coverage](https://scrutinizer-ci.com/g/patrikx3/grunt-p3x-express/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/patrikx3/grunt-p3x-express/?branch=master) 

  
[![NPM](https://nodei.co/npm/grunt-p3x-express.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/grunt-p3x-express/)
---

 
# Grunt Express Server

This is an open source project. Just code.

### Node Version Requirement 
``` 
>=7.8.0 
```  
   
### Built on Node 
``` 
v8.4.0
```   
   
The ```async``` and ```await``` keywords are required.

Install NodeJs:    
https://nodejs.org/en/download/package-manager/    

# Description  

                        
[//]: #@corifeus-header:end


Simple grunt task for running an Express server that works great with LiveReload + Watch/Regarde

## Getting Started

This plugin requires Grunt `>=1.0.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-p3x-express --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-p3x-express');
```

## The `express` task

### Setup

In your project's Gruntfile, you can create one or multiple servers:

```js
grunt.initConfig({
  express: {
    options: {
      // Override defaults here
    },
    dev: {
      options: {
        script: 'path/to/dev/server.js'
      }
    },
    prod: {
      options: {
        script: 'path/to/prod/server.js',
        node_env: 'production'
      }
    },
    test: {
      options: {
        script: 'path/to/test/server.js'
      }
    }
  }
});
```

You can override the default `options` either in the root of the `express` config
or within each individual server task.

### Default `options`

```js
  express: {
    options: {
      // Override the command used to start the server.
      // (do not use 'coffee' here, the server will not be able to restart
      //  see below at opts for coffee-script support)
      cmd: process.argv[0],

      // Will turn into: `node OPT1 OPT2 ... OPTN path/to/server.js ARG1 ARG2 ... ARGN`
      // (e.g. opts: ['node_modules/coffee-script/bin/coffee'] will correctly parse coffee-script)
      opts: [ ],
      args: [ ],

      // Setting to `false` will effectively just run `node path/to/server.js`
      background: true,

      // Called when the spawned server throws errors
      fallback: function() {},

      // Override node env's PORT
      port: 3000,

      // Override node env's NODE_ENV
      node_env: undefined,

      // Enable Node's --harmony flag
      harmony: false,

      // Consider the server to be "running" after an explicit delay (in milliseconds)
      // (e.g. when server has no initial output)
      delay: 0,

      // Regular expression that matches server output to indicate it is "running"
      output: ".+",

      // Set --debug (true | false | integer from 1024 to 65535, has precedence over breakOnFirstLine)
      debug: false,

      // Set --debug-brk (true | false | integer from 1024 to 65535)
      breakOnFirstLine: false,

      // Object with properties `out` and `err` both will take a path to a log file and
      // append the output of the server. Make sure the folders exist.
      logs: undefined

    }
  }
```

### Usage

By default, unless `delay` or `output` has been customized,
**the server is considered "running" once any output is logged to the console**,
upon which control is passed back to grunt.

Typically, this is:

> Express server listening on port 3000

If your server doesn't log anything, the express task will never finish and **none** of the following tasks, after it, will be executed. For example - if you have a development task like this one:

```javascript
grunt.registerTask('rebuild', ['clean', 'browserify:scripts', 'stylus', 'copy:images']);
grunt.registerTask('dev', ['rebuild', 'express', 'watch']);
```

If you run the dev task and your server doesn't log anything, **'watch' will never be started**.

This can easily be avoided, if you log something, when server is created like that:

```javascript
var server = http.createServer( app ).listen( PORT, function() {
    console.log('Express server listening on port ' + PORT);
} );
```

If you log output *before* the server is running, either set `delay` or `output` to indicate
when the server has officially started.

#### Starting the server

If you have a server defined named `dev`, you can start the server by running `express:dev`. The server only runs as long as grunt is running. Once grunt's tasks have completed, the web server stops.

#### Stopping the server

Similarly, if you start the `dev` server with `express:dev`, you can stop the server
with `express:dev:stop`.

#### With [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)

```js
grunt.initConfig({
  watch: {
    express: {
      files:  [ '**/*.js' ],
      tasks:  [ 'express:dev' ],
      options: {
        spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
      }
    }
  }
});

grunt.registerTask('server', [ 'express:dev', 'watch' ])
```

**Important:** Note that the `spawn: false` options only need be applied to the watch target regarding the express task.
You may have other watch targets that use `spawn: true`, which is useful, for example, to reload CSS and not LESS changes.

```js
watch: {
  options: {
    livereload: true
  },
  express: {
    files:  [ '**/*.js' ],
    tasks:  [ 'express:dev' ],
    options: {
      spawn: false
    }
  },
  less: {
    files: ["public/**/*.less"],
    tasks: ["less"],
    options: {
      livereload: false
    }
  },
  public: {
    files: ["public/**/*.css", "public/**/*.js"]
  }
}
```

## Release History

### Old version
https://github.com/ericclemmons/grunt-express-server

[//]: #@corifeus-footer

---

[**GRUNT-P3X-EXPRESS**](https://pages.corifeus.com/grunt-p3x-express) Build v1.0.92-81

[Corifeus](http://www.corifeus.com) by [Patrik Laszlo](http://patrikx3.com)

[//]: #@corifeus-footer:end