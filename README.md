# grunt-express-server

> Grunt task for running an Express Server that works great with LiveReload + Watch/Regarde

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-express-server --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-express-server');
```

## The "server" task

### Setup

In your project's Gruntfile, simply add a `script` property to your existing `server` object.

```js
grunt.initConfig({
  server: {
    script: 'path/to/server.js'
  }
})
```

### Usage

#### With [grunt-contrib-livereload](https://github.com/gruntjs/grunt-contrib-livereload)

```js
grunt.initConfig({
  watch: {
    server: {
      files:  '<%= dirs.server + files.all %>',
      tasks:  [ 'express-server', 'livereload' ]
    }
  }
});

grunt.registerTask('server', [ 'express-server', 'livereload', 'watch' ])
```

This will let you override `grunt server` with a LiveReload-able Express Server.
Finally, you can make changes to your API and watch the JSON change in your browser!

#### With [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)

```js
grunt.initConfig({
  watch: {
    server: {
      files:  [ '**/*.js' ],
      tasks:  [ 'express-server' ],
      options: {
        nospawn: true //Without this option specified express-server won't be reloaded
      }
    }
  }
});

grunt.registerTask('server', [ 'express-server', 'watch' ])
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### v0.1.0

- Initial import from [Genesis Skeleton](https://github.com/ericclemmons/genesis-skeleton) & release
