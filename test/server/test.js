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
      _.forEach(body.trips, function(trip, index) {
        expect(trip.id).to.exist;
        expect(trip.name).to.eql(this.getTripsFixture.response[index].name);
      }.bind(this));
      done();
    }.bind(this));
  });
});
