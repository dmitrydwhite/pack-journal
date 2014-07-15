'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var db = require('mongoose');

describe('User API', function() {
  before(function(done) {
    this.postUserFixture = __fixture('post-user');
    server.listen(9001, function() {
      done();
    });
    helpers.setUpUserFixtures();
  });

  after(function() {
    helpers.tearDownUserFixtures();
  });

  it('Correctly responds to POST request', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.postUserFixture.request.url,
      method: this.postUserFixture.request.method,
      json: this.postUserFixture.request.json
    }, function(err, res, body) {
        expect(res.statusCode).to.eql(200);
        expect(body.user.id).to.exist;
        expect(body.user.username).to.eql(this.postUserFixture.response.user.username);
      done();
    }.bind(this));
  });

  it('Inserts a user into the database on a POST request', function(done) {
    var User = db.model('User');
    User.find({ username: this.postUserFixture.request.json.user.username }, function(err, docs) {
      expect(docs[0].username).to.eql(this.postUserFixture.request.json.user.username);
      expect(docs[0].passwordDigest).to.exist;
      expect(docs[0]._id).to.exist;
      expect(docs[0].sessionDigests.length).to.be.eql(1);
      done();
    }.bind(this));
  });

});