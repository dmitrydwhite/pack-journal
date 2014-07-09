'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('../server_helper');

describe('Trips API', function() {
  before(function() {
    server.listen(9000);
    //helpers.setUpDBFixtures();
    this.getTripsFixture = __fixture('get-trips');
  });

  it('Gets a valid list of all trips', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.getTripsFixture.request.url,
      method: this.getTripsFixture.request.method
    }, function(err, res, body) {
      // TODO: Inspect res and make sure we get a 200 back
      expect(body).to.eql(this.getTripsFixture.response);
      console.log(body);
      console.log(res);
      done();
    }.bind(this));
  });
});