'use strict';

var db = require('mongoose');
var Promise = require('bluebird');

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

exports.setUpUserFixtures = function(cb) {
  this.authUserFixture = __fixture('auth-user');
  var user = db.model('User');
  user.collection.drop();
  user.create(this.authUserFixture.db, function(err, doc) {
    cb(err, doc);
  });
};

exports.tearDownUserFixtures = function() {
  var user = db.model('User');
  user.collection.drop();
};