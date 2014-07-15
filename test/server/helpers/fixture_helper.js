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

exports.setUpUserFixtures = function() {
  // var trip = db.model('Trip');
  // this.getTripsFixture = __fixture('get-trips');
  // trip.collection.drop();
  // return Promise.all([
  //   trip.create(this.getTripsFixture.response.trips[0]),
  //   trip.create(this.getTripsFixture.response.trips[1])
  // ]);
};

exports.tearDownUserFixtures = function() {
  // var trip = db.model('Trip');
  // return trip.collection.drop();
};