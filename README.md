# grunt-express-server

[![Build Status](https://travis-ci.org/ericclemmons/grunt-express-server.png?branch=master)](https://travis-ci.org/ericclemmons/grunt-express-server)
[![Dependencies](https://david-dm.org/ericclemmons/grunt-express-server.png)](https://david-dm.org/ericclemmons/grunt-express-server)
[![devDependencies](https://david-dm.org/ericclemmons/grunt-express-server/dev-status.png)](https://david-dm.org/ericclemmons/grunt-express-server#info=devDependencies&view=table)

> Simple grunt task for running an Express server that works great with LiveReload + Watch/Regarde

## Getting Started

This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-express-server --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-express-server');
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

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- v0.5.3 - Update peerDeps and enable travis build against Node 4
- v0.5.2 - Add `hardStop` flag ([#99](https://github.com/ericclemmons/grunt-express-server/pull/99))
- v0.5.1 - Add `harmony` flag ([#86](https://github.com/ericclemmons/grunt-express-server/pull/86))
- v0.5.0 - Add breakOnFirstLine option, support for debug ports and fix bugs. Details: ([#68](https://github.com/ericclemmons/grunt-express-server/pull/68), [#70](https://github.com/ericclemmons/grunt-express-server/pull/70), [#73](https://github.com/ericclemmons/grunt-express-server/pull/73))
- v0.4.19 – Use `process.env.PORT` before `3000` ([#59](https://github.com/ericclemmons/grunt-express-server/pull/59))
- v0.4.18 – Fix for when running the node debugger ([#57](https://github.com/ericclemmons/grunt-express-server/pull/57))
- v0.4.17 – Update `devDependencies`...again
- v0.4.16 – Update `devDependencies`
- v0.4.15 – Recommend using local `coffee` with additional arguments ([#50](https://github.com/ericclemmons/grunt-express-server/pull/50))
- v0.4.14 – Attempt to fix issues running Coffeescript ([#54](https://github.com/ericclemmons/grunt-express-server/pull/54))
- v0.4.13 – Add `--nodejs` for Coffeescript users ([#37](https://github.com/ericclemmons/grunt-express-server/issues/37))
- v0.4.12 – Only remove this task's listeners ([#39](https://github.com/ericclemmons/grunt-express-server/pull/39))
- v0.4.11 – Revert v0.4.10 until Travis can reproduce it
- v0.4.10 – Another attempt to fix #28 & #30's server restarting issue ([#31](https://github.com/ericclemmons/grunt-express-server/pull/31))
- v0.4.9 – Revert v0.4.8 until [#30](https://github.com/ericclemmons/grunt-express-server/issues/30#issuecomment-29931192) is resolved
- v0.4.8 – Fix issue with start/restarting multiple instances ([#29](https://github.com/ericclemmons/grunt-express-server/pull/29))
- v0.4.7 – Remove broken `error` option ([#27](https://github.com/ericclemmons/grunt-express-server/issues/27))
- v0.4.6 – Store running servers on `process._servers[target]` ([#22](https://github.com/ericclemmons/grunt-express-server/issues/22))
- v0.4.5 – Support multiple servers running at once ([#23](https://github.com/ericclemmons/grunt-express-server/pull/23))
- v0.4.4 - Fix for using `grunt-env` to change environments, thanks to @FredrikAppelros ([#20](https://github.com/ericclemmons/grunt-express-server/pull/20))
- v0.4.3 - Add `cmd` option that defaults to Node, but can be set to `coffee` for Coffeescript support, thanks to @JonET ([#15](https://github.com/ericclemmons/grunt-express-server/pull/15))
- v0.4.2 - Add `debug` option that gets enables Node's debugger, ideally for use with [node-inspector](https://github.com/node-inspector/node-inspector)
- v0.4.1 - Add `node_env` option that sets `NODE_ENV` when running the server & restores original env upon closing, thanks to @jgable!
- v0.4.0
  - Add `delay` option that, when set, passes control back to grunt after timeout
  - Add `output` regular expression option that, when set, waits for matching message before passing control back to grunt
- v0.3.1 - Try to force notification that `express` task has finished as much as possible
- v0.3.0 - `express` is now a multitask with customizable options, better error handling and `:stop` task
- v0.2.0
  - Change `express-server` task to `express`
  - Config is set via `express: '...'` instead of `server: { script: '...' } `
- v0.1.0 - Initial import from [Genesis Skeleton](https://github.com/ericclemmons/genesis-skeleton) & release


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ericclemmons/grunt-express-server/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
