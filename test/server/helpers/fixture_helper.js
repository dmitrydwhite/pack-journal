'use strict';

var Promise = require('bluebird');
var Trip = require('../../../server/models/trip').Trip;
var User = require('../../../server/models/user').User;
var tripFixture = __fixture('trip-fixture');
var userFixture = __fixture('user-fixture');
var createdUserId;

exports.setUpTripFixtures = function() {
  var self = this;

  return Promise.all([
    self.tearDownTripFixtures(),
    self.tearDownUserFixtures()
  ]).then(function() {
    return self.setUpUserFixtures();
  }).then(function() {
    var trip = tripFixture.getManyData.trips[0];
    trip.owner = createdUserId;
    return Trip.createAsync(trip);
  }).then(function() {
    var trip = tripFixture.getManyData.trips[1];
    trip.owner = createdUserId;
    return Trip.createAsync(tripFixture.getManyData.trips[1]);
  });
};

exports.tearDownTripFixtures = function() {
  return Trip.removeAsync();
};

exports.setUpUserFixtures = function() {
  return User.createAsync(userFixture.dbFixtures[0])
  .then(function() {
    return User.createAsync(userFixture.dbFixtures[1]);
  })
  .then(function(user) {
    createdUserId = user._id;
  });
};

exports.tearDownUserFixtures = function() {
  return User.removeAsync();
};