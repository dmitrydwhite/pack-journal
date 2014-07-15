'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var db = require('mongoose');

describe('Trips API', function() {
  before(function(done) {
    server.listen(9000);
    this.getTripsFixture = __fixture('post-user');
    helpers.setUpUserFixtures().then(function() {done();}, done);
  });

  after(function() {
    helpers.tearDownUserFixtures();
  });

});