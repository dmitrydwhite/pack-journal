'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var _ = require('lodash');
var tripFixture = __fixture('trip-fixture');
var userFixture = __fixture('user-fixture');
var Trip = require('../../server/models/trip').Trip;

describe('Trips API', function() {
  before(function(done) {
    helpers.setUpTripFixtures()
    .then(function() {
      server.listen(9000);
      done();
    })
    .catch(function(e) {
      console.log('Unable to set up trip fixtures and start server:', e);
      done(e);
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

  it('Correctly responds to POST request', function(done) {
    request({
      url: 'http://localhost:' + '9000' + tripFixture.url,
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
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Gets a single trip', function(done) {
    request({
      url: 'http://localhost:' + '9000' + tripFixture.url +
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
      url: 'http://localhost:' + '9000' + tripFixture.url +
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
    .then(function(docs) {
      expect(docs.name).to.eql(tripFixture.afterPutData.trip.name);
      expect(docs.owner).to.exist;
      // expect(docs.features.waypoints[0])
      //   .to.eql(tripFixture.afterPutData.trip.features.waypoints[0]);
      // expect(docs.features.waypoints[1])
      //   .to.eql(tripFixture.afterPutData.trip.features.waypoints[1]);
      tripFixture.afterPutData.trip.id = docs._id;
      expect(docs._id).to.exist;
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });


  it('Deletes a trip', function(done) {
    request({
      url: 'http://localhost:' + '9000' + tripFixture.url +
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
