'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var _ = require('lodash');
var tripFixture = __fixture('trip-fixture');
var userFixture = __fixture('user-fixture');

describe('Trips API', function() {
  before(function(done) {
    helpers.setUpTripFixtures()
    .then(function() {
      server.listen(9000);
      done();
    })
    .catch(function(e) {
      console.log('Unable to set up trip fixtures and start server:', e);
      done();
    });
  });

  after(function() {
    helpers.tearDownTripFixtures();
  });

  it('Gets a valid list of all trips', function(done) {
    request({
      url: 'http://localhost:' + '9000' + tripFixture.url,
      method: 'GET',
      headers: userFixture.dbTokenAuths[1]
    })
    .spread(function(res, body) {
      expect(res.statusCode).to.eql(200);
      var bodyObj = JSON.parse(body);
      _.forEach(bodyObj.trips, function(trip, index) {
        expect(trip.id).to.exist;
        expect(trip.name).to.eql(tripFixture.getManyData.trips[index].name);
        expect(trip.features).to.eql(tripFixture.getManyData.trips[index].features);
      });
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  // it.skip('Correctly responds to POST request', function(done) {
  //   var requestJson = this.postTripsFixture.request.json;
  //   requestJson.trip.owner = insertedUserId;
  //   request({
  //     url: 'http://localhost:' + '9000' + this.postTripsFixture.request.url,
  //     method: this.postTripsFixture.request.method,
  //     json: requestJson
  //   }, function(err, res, body) {
  //       expect(res.statusCode).to.eql(200);
  //       expect(body.trip.id).to.exist;
  //       insertedTripId = body.trip.id;
  //       expect(body.trip.owner).to.eql(insertedUserId.toString());
  //       expect(body.trip.name).to.eql(this.postTripsFixture.response.trip.name);
  //       expect(body.trip.features).to.eql(this.postTripsFixture.response.trip.features);
  //     done();
  //   }.bind(this));
  // });

  // it.skip('Inserts a trip into the database on a POST request', function(done) {
  //   var Trip = db.model('Trip');
  //   Trip.find({ name: this.postTripsFixture.request.json.trip.name }, function(err, docs) {
  //     expect(docs[0].name).to.eql(this.postTripsFixture.request.json.trip.name);
  //     expect(docs[0].owner).to.eql(insertedUserId);
  //     expect(docs[0].features.waypoints[0])
  //       .to.eql(this.postTripsFixture.request.json.trip.features.waypoints[0]);
  //     expect(docs[0].features.waypoints[1])
  //       .to.eql(this.postTripsFixture.request.json.trip.features.waypoints[1]);
  //     expect(docs[0]._id).to.exist;
  //     done();
  //   }.bind(this));
  // });

  // it.skip('Gets a single trip', function(done) {
  //   request({
  //     url: 'http://localhost:' + '9000' + this.getTripsFixture.request.url +
  //       '/' + insertedTripId,
  //     method: this.getTripsFixture.request.method
  //   }, function(err, res, body) {
  //     expect(res.statusCode).to.eql(200);
  //     var bodyObj = JSON.parse(body);
  //     expect(bodyObj.trip.id).to.eql(insertedTripId);
  //     expect(bodyObj.trip.name).to.eql(this.getTripFixture.response.trip.name);
  //     expect(bodyObj.trip.features).to.eql(this.getTripFixture.response.trip.features);
  //     done();
  //   }.bind(this));
  // });

  // it.skip('Updates an existing trip', function(done) {
  //   var requestJSON = this.putTripFixture.request.json;
  //   requestJSON.trip.owner = insertedUserId;
  //   request({
  //     url: 'http://localhost:' + '9000' + this.putTripFixture.request.url +
  //       '/' + insertedTripId,
  //     method: this.putTripFixture.request.method,
  //     json: requestJSON
  //   }, function(err, res, body) {
  //     expect(res.statusCode).to.eql(200);
  //     expect(body.trip.id).to.eql(insertedTripId);
  //     expect(body.trip.name).to.eql(this.putTripFixture.response.trip.name);
  //     expect(body.trip.owner).to.eql(insertedUserId.toString());
  //     expect(body.trip.features).to.eql(this.putTripFixture.response.trip.features);
  //     done();
  //   }.bind(this));
  // });

  // it.skip('Changes a trip in the database on a PUT request', function(done) {
  //   var Trip = db.model('Trip');
  //   Trip.findById(insertedTripId, function(err, doc) {
  //     expect(doc.name).to.eql(this.putTripFixture.request.json.trip.name);
  //     expect(doc.owner).to.eql(insertedUserId);
  //     expect(doc.features.waypoints[0])
  //       .to.eql(this.putTripFixture.request.json.trip.features.waypoints[0]);
  //     expect(doc.features.waypoints[1])
  //       .to.eql(this.putTripFixture.request.json.trip.features.waypoints[1]);
  //     expect(doc._id.toString()).to.equal(insertedTripId);
  //     done();
  //   }.bind(this));
  // });

  // it.skip('Deletes a trip', function(done) {
  //   request({
  //     url: 'http://localhost:' + '9000' + this.deleteTripFixture.request.url +
  //       '/' + insertedTripId,
  //     method: this.deleteTripFixture.request.method
  //   }, function(err, res, body) {
  //     expect(res.statusCode).to.eql(200);
  //     var bodyObj = JSON.parse(body);
  //     expect(bodyObj.trip.id).to.eql(insertedTripId);
  //     expect(bodyObj.trip.name).to.eql(this.deleteTripFixture.response.trip.name);
  //     expect(bodyObj.trip.owner).to.eql(insertedUserId.toString());
  //     expect(bodyObj.trip.features).to.eql(this.deleteTripFixture.response.trip.features);
  //     done();
  //   }.bind(this));
  // });

  // it.skip('Deletes a trip from the database on a DELETE request', function(done) {
  //   var Trip = db.model('Trip');
  //   Trip.findById(insertedTripId, function(err, doc) {
  //     expect(doc).to.not.exist;
  //     done();
  //   }.bind(this));
  // });

});
