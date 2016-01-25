/*
 * grunt-express-server
 * https://github.com/ericclemmons/grunt-express-server
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var get = require('./lib/get');

module.exports.custom_node_path = {
  test_site_configured_node_path: function(test) {
    test.expect(2);
    get('http://localhost:3000/path', function(res, body) {
      test.equal(res.statusCode, 200, 'should return 200');
      test.equal(body, 'Your NODE_PATH is "shared".', 'should return NODE_PATH = "shared"');
      test.done();
    }, function(err) {
      test.done();
    });
  }
};
