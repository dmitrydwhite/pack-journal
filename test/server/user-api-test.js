'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var server = require('../../server/application');
var helpers = require('./helpers/fixture_helper');
var userFixture = __fixture('user-fixture');

describe('User API', function() {
  before(function(done) {
    helpers.setUpUserFixtures()
    .then(function() {
      server.listen(9001);
      done();
    })
    .catch(function(e) {
      console.log('Unable to set up trip fixtures and start server:', e);
      done(e);
    });
  });

  after(function() {
    helpers.tearDownUserFixtures();
  });

  it('Correctly responds when creating a user', function(done) {
    request({
      url: 'http://localhost:' + '9001' + userFixture.userUrl,
      method: 'POST',
      json: userFixture.apiFixtureUser
    })
    .spread(function(res, body) {
      expect(res.statusCode).to.eql(200);
      expect(body.user.id).to.exist;
      expect(body.user.username).to.eql(userFixture.apiFixtureUser.user.username);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Inserts a user into the database when a user is created', function(done) {
    var User = require('../../server/models/user').User;
    User.findOneAsync({ username: userFixture.apiFixtureUser.user.username })
    .then(function(doc) {
      expect(doc.username).to.eql(userFixture.apiFixtureUser.user.username);
      expect(doc.passwordDigest).to.exist;
      expect(doc._id).to.exist;
      expect(doc.sessionDigests.length).to.be.eql(1);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('Authenticates an existing user and can delete a session (i.e. logout)', function(done) {
    request({
      url: 'http://localhost:' + '9001' + userFixture.authUrl,
      method: 'POST',
      headers: userFixture.dbTokenAuths[1],
      json: userFixture.apiFixtureSession
    })
    .spread(function(res, body) {
      expect(body.session).to.exist;
      expect(body.session.id).to.exist;
      return request({
        url: 'http://localhost:' + '9001' + userFixture.logoutUrl,
        method: 'DELETE',
        headers: { 'Authorization': userFixture.dbTokenAuths[1] }
      });
    })
    .spread(function(res, body) {
        expect(JSON.parse(body)).to.eql({ error: 'invalid credentials' });
        expect(res.statusCode).to.eql(401);
        done();
    })
    .catch(function(e) {
      done(e);
    });
  });

//   // TODO: implement fixture and test for login
//   it.skip('Logs in an existing user using password');

});