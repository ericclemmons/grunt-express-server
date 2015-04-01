/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var get = require('./lib/get');

module.exports.custom_args = {
  test_runs_in_harmony: function(test) {
    test.expect(2);
    get('http://localhost:3000/harmony', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Harmony flag idx is 0');
      test.done();
    }, function(err) {
      test.done();
    });
  }
};
