'use strict';

var db = require('mongoose');
var Promise = require('bluebird');
var config = require('../../../server/config');

exports.setUpTripFixtures = function() {
  var trip = db.model('Trip');
  this.getTripsFixture = __fixture('get-trips');
  trip.collection.drop();
  return Promise.all([
    trip.create(this.getTripsFixture.response.trips[0]),
    trip.create(this.getTripsFixture.response.trips[1])
  ]);
};

exports.tearDownTripFixtures = function() {
  var trip = db.model('Trip');
  return trip.collection.drop();
};

exports.setUpUserFixtures = function(done) {
  this.authUserFixture = __fixture('auth-user');
  var user = db.model('User');
  user.collection.drop();
  user.create(this.authUserFixture.db);
};

exports.tearDownUserFixtures = function() {
  var user = db.model('User');
  user.collection.drop();
};