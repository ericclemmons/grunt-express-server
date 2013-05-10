/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var get = require('./lib/get');

module.exports.express = {
  1: function(test) {
    test.expect(2);

    get('http://localhost:3000/1', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Howdy 1!\n', 'should return static page');
      test.done();
    });
  },

  2: function(test) {
    test.expect(2);

    get('http://localhost:3000/1', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Howdy 2!\n', 'should return static page');
      test.done();
    });
  }
};
