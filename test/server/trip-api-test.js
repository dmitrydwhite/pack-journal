'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var app = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var _ = require('lodash');
var tripFixture = __fixture('trip-fixture');
var userFixture = __fixture('user-fixture');
var Trip = require('../../server/models/trip').Trip;
var server;
var PORT = 9000;

describe('Trips API', function() {
  before(function(done) {
    helpers.setUpTripFixtures()
    .then(function() {
      server = app.listen(PORT, function() {
        done();
      });
    })
    .catch(function(e) {
      console.log('Unable to set up trip fixtures and start server:', e);
      done(e);
    });
  });

  after(function(done) {
    helpers.tearDownTripFixtures();
    server.close(function(){
      done();
    });
  });

  it('Gets a valid list of all trips', function(done) {
    request({
      url: 'http://localhost:' + PORT + tripFixture.url,
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

  it('Correctly responds to POST request', function(done) {
    request({
      url: 'http://localhost:' + PORT + tripFixture.url,
      method: 'POST',
      headers: userFixture.dbTokenAuths[0],
      json: tripFixture.initialData
    })
    .spread(function(res, body) {
        expect(res.statusCode).to.eql(200);
        expect(body.trip.id).to.exist;
        expect(body.trip.name).to.eql(tripFixture.initialData.trip.name);
        expect(body.trip.features).to.eql(tripFixture.initialData.trip.features);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Inserts a trip into the database on a POST request', function(done) {
    Trip.findOneAsync({ name: tripFixture.initialData.trip.name })
    .then(function(doc) {
      expect(doc._id).to.exist;
      tripFixture.initialData.trip.id = doc._id;
      expect(doc.name).to.eql(tripFixture.initialData.trip.name);
      expect(doc.owner).to.exist;
      expect(doc.features.waypoints[0].toJSON())
        .to.eql(tripFixture.initialData.trip.features.waypoints[0]);
      expect(doc.features.waypoints[1].toJSON())
        .to.eql(tripFixture.initialData.trip.features.waypoints[1]);
      expect(doc.features.textAnnotations[0].toJSON())
        .to.eql(tripFixture.initialData.trip.features.textAnnotations[0]);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Gets a single trip', function(done) {
    request({
      url: 'http://localhost:' + PORT + tripFixture.url +
        '/' + tripFixture.initialData.trip.id,
      headers: userFixture.dbTokenAuths[0],
      method: 'GET'
    })
    .spread(function(res, body) {
      expect(res.statusCode).to.eql(200);
      var bodyObj = JSON.parse(body);
      expect(bodyObj.trip.id).to.eql(tripFixture.initialData.trip.id.toString());
      expect(bodyObj.trip.name).to.eql(tripFixture.initialData.trip.name);
      expect(bodyObj.trip.features).to.eql(tripFixture.initialData.trip.features);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Updates an existing trip', function(done) {
    request({
      url: 'http://localhost:' + PORT + tripFixture.url +
        '/' + tripFixture.initialData.trip.id,
      method: 'PUT',
      headers: userFixture.dbTokenAuths[0],
      json: tripFixture.afterPutData
    })
    .spread(function(res, body) {
      expect(res.statusCode).to.eql(200);
      expect(body.trip.id).to.eql(tripFixture.initialData.trip.id.toString());
      expect(body.trip.name).to.eql(tripFixture.afterPutData.trip.name);
      expect(body.trip.features).to.eql(tripFixture.afterPutData.trip.features);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Inserts a trip into the database on a PUT request', function(done) {
    Trip.findOneAsync({ name: tripFixture.afterPutData.trip.name })
    .then(function(doc) {
      expect(doc.name).to.eql(tripFixture.afterPutData.trip.name);
      expect(doc.owner).to.exist;
      expect(doc.features.waypoints[0].toJSON())
        .to.eql(tripFixture.afterPutData.trip.features.waypoints[0]);
      expect(doc.features.waypoints[1].toJSON())
        .to.eql(tripFixture.afterPutData.trip.features.waypoints[1]);
      expect(doc.features.textAnnotations[0].toJSON())
        .to.eql(tripFixture.afterPutData.trip.features.textAnnotations[0]);
      tripFixture.afterPutData.trip.id = doc._id;
      expect(doc._id).to.exist;
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });


  it('Deletes a trip', function(done) {
    request({
      url: 'http://localhost:' + 9000 + tripFixture.url +
        '/' + tripFixture.initialData.trip.id,
      headers: userFixture.dbTokenAuths[0],
      method: 'DELETE'
    })
    .spread(function(res, body) {
      expect(res.statusCode).to.eql(200);
      var bodyObj = JSON.parse(body);
      expect(bodyObj.trip.id).to.eql(tripFixture.initialData.trip.id.toString());
      expect(bodyObj.trip.name).to.eql(tripFixture.afterPutData.trip.name);
      expect(bodyObj.trip.features).to.eql(tripFixture.afterPutData.trip.features);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Deletes a trip from the database on a DELETE request', function(done) {
    Trip.findByIdAsync(tripFixture.initialData.trip.id)
    .then(function(doc) {
      expect(doc).to.not.exist;
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

});
