'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var _ = require('lodash');

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
        expect(trip._id).to.exist;
        expect(trip.name).to.eql(this.getTripsFixture.response.trips[index].name);
      }.bind(this));
      done();
    }.bind(this));
  });

  it('Correctly communicates with db', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.postTripsFixture.request.url,
      method: this.postTripsFixture.request.method,
      json: this.postTripsFixture.request.json
    }, function(err, res, body) {
      // TODO: Inspect res and make sure we get a 200 back
        expect(body.trip._id).to.exist;
        expect(body.trip.name).to.eql(this.postTripsFixture.response.trip.name);
      done();
    }.bind(this));
  });
});
