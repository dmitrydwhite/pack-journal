'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var _ = require('lodash');
var db = require('mongoose');

var insertedTripId;

describe('Trips API', function() {
  before(function(done) {
    server.listen(9000);
    this.getTripsFixture = __fixture('get-trips');
    this.postTripsFixture = __fixture('post-trips');
    this.getTripFixture = __fixture('get-trip');
    this.putTripFixture = __fixture('put-trip');
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
      expect(res.statusCode).to.eql(200);
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
        expect(res.statusCode).to.eql(200);
        expect(body.trip.id).to.exist;
        insertedTripId = body.trip.id;
        expect(body.trip.name).to.eql(this.postTripsFixture.response.trip.name);
        expect(body.trip.features).to.eql(this.postTripsFixture.response.trip.features);
      done();
    }.bind(this));
  });

  it('Inserts a trip into the database on a POST request', function(done) {
    var Trip = db.model('Trip');
    Trip.find({ name: this.postTripsFixture.request.json.trip.name }, function(err, docs) {
      expect(docs[0].name).to.eql(this.postTripsFixture.request.json.trip.name);
      expect(docs[0].features.waypoints[0])
        .to.eql(this.postTripsFixture.request.json.trip.features.waypoints[0]);
      expect(docs[0].features.waypoints[1])
        .to.eql(this.postTripsFixture.request.json.trip.features.waypoints[1]);
      expect(docs[0]._id).to.exist;
      done();
    }.bind(this));
  });

  it('Gets a single trip', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.getTripsFixture.request.url +
        '/' + insertedTripId,
      method: this.getTripsFixture.request.method
    }, function(err, res, body) {
      expect(res.statusCode).to.eql(200);
      var bodyObj = JSON.parse(body);
      expect(bodyObj.trip.id).to.eql(insertedTripId);
      expect(bodyObj.trip.name).to.eql(this.getTripFixture.response.trip.name);
      expect(bodyObj.trip.features).to.eql(this.getTripFixture.response.trip.features);
      done();
    }.bind(this));
  });

  it('Updates and existing trip', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.putTripFixture.request.url +
        '/' + insertedTripId,
      method: this.putTripFixture.request.method
    }, function(err, res, body) {
      expect(res.statusCode).to.eql(200);
      var bodyObj = JSON.parse(body);
      expect(bodyObj.trip.id).to.eql(insertedTripId);
      expect(bodyObj.trip.name).to.eql(this.putTripFixture.response.trip.name);
      expect(bodyObj.trip.features).to.eql(this.putTripFixture.response.trip.features);
      done();
    }.bind(this));
  });

  it('Changes a trip in the database on a PUT request', function(done) {
    var Trip = db.model('Trip');
    Trip.findById(insertedTripId, function(err, doc) {
      expect(doc.name).to.eql(this.putTripFixture.request.json.trip.name);
      expect(doc.features.waypoints[0])
        .to.eql(this.putTripFixture.request.json.trip.features.waypoints[0]);
      expect(doc.features.waypoints[1])
        .to.eql(this.putTripFixture.request.json.trip.features.waypoints[1]);
      expect(doc._id).to.eql(insertedTripId);
      done();
    }.bind(this));
  });

});
