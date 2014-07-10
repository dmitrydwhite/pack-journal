'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var _ = require('lodash');
var db = require('mongoose');
var util = require('util');

describe('Trips API', function() {
  before(function(done) {
    server.listen(9000);
    this.getTripsFixture = __fixture('get-trips');
    this.postTripsFixture = __fixture('post-trips');
    helpers.setUpDBFixtures().then(function() {done();}, done);
  });

  after(function() {
    helpers.tearDownDBFixtures();
  });

  it('Gets a valid list of all trips', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.getTripsFixture.request.url,
      method: this.getTripsFixture.request.method
    }, function(err, res, body) {
      // TODO: Inspect res and make sure we get a 200 back
      var bodyObj = JSON.parse(body);
      _.forEach(bodyObj.trips, function(trip, index) {
        expect(trip.id).to.exist;
        expect(trip.name).to.eql(this.getTripsFixture.response.trips[index].name);
        expect(trip.features).to.eql(this.getTripsFixture.response.trips[index].features);
      }.bind(this));
      done();
    }.bind(this));
  });

  it('Correctly responds to POST request', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.postTripsFixture.request.url,
      method: this.postTripsFixture.request.method,
      json: this.postTripsFixture.request.json
    }, function(err, res, body) {
      // TODO: Inspect res and make sure we get a 200 back
        expect(body.trip.id).to.exist;
        expect(body.trip.name).to.eql(this.postTripsFixture.response.trip.name);
        expect(body.trip.features).to.eql(this.postTripsFixture.response.trip.features);
      done();
    }.bind(this));
  });

  it('Inserts a trip into the database on a POST request', function(done) {
    var Trip = db.model('Trip');
    Trip.find({ name: this.postTripsFixture.request.json.name }, function(err, docs) {
      debugger;
      expect(docs[0].name).to.eql(this.postTripsFixture.request.json.name);
      expect(docs[0].features.waypoints[0])
        .to.eql(this.postTripsFixture.request.json.features.waypoints[0]);
      expect(docs[0].features.waypoints[1])
        .to.eql(this.postTripsFixture.request.json.features.waypoints[1]);
      expect(docs[0]._id).to.exist;
      done();
    }.bind(this));
  });
});
