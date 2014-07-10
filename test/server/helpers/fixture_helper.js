'use strict';

var db = require('mongoose');
var Promise = require('bluebird');

exports.setUpDBFixtures = function() {
  var trip = db.model('Trip');
  this.getTripsFixture = __fixture('get-trips');
  return Promise.all([
    trip.create(this.getTripsFixture.response.trips[0]),
    trip.create(this.getTripsFixture.response.trips[1])
  ]);
};

exports.tearDownDBFixtures = function() {
  var trip = db.model('Trip');
  return trip.collection.drop();
};