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

  it('Correctly responds to POST request', function(done) {
    request({
      url: 'http://localhost:' + '9001' + userFixture.url,
      method: 'POST',
      json: userFixture.apiFixture
    })
    .spread(function(res, body) {
      expect(res.statusCode).to.eql(200);
      expect(body.user.id).to.exist;
      expect(body.user.username).to.eql(userFixture.apiFixture.user.username);
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

//   it('Inserts a user into the database on a POST request', function(done) {
//     var User = db.model('User');
//     User.find({ username: this.postUserFixture.request.json.user.username }, function(err, docs) {
//       expect(docs[0].username).to.eql(this.postUserFixture.request.json.user.username);
//       expect(docs[0].passwordDigest).to.exist;
//       expect(docs[0]._id).to.exist;
//       expect(docs[0].sessionDigests.length).to.be.eql(1);
//       done();
//     }.bind(this));
//   });

//   it('Authenticates an existing user and can delete a session (i.e. logout)', function(done) {
//     request({
//       url: 'http://localhost:' + '9000' + this.authUserFixture.request.url,
//       method: this.authUserFixture.request.method,
//       headers: { 'Authorization': this.authUserFixture.request.authorization}
//     }, function(err, res, body) {
//       expect(JSON.parse(body)).to.eql(this.authUserFixture.response);
//       request({
//         url: 'http://localhost:' + '9000' + this.authUserFixture.request.url,
//         method: this.authUserFixture.request.method,
//         headers: { 'Authorization': this.authUserFixture.request.authorization }
//       }, function(err, res, body) {
//         expect(JSON.parse(body)).to.eql({ error: 'invalid credentials' });
//         expect(res.statusCode).to.eql(401);
//         done();
//       });
//     }.bind(this));
//   });

//   // TODO: implement fixture and test for login
//   it.skip('Logs in an existing user using password');

});