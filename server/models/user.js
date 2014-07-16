var Promise = require('bluebird');

var UserSchema = new db.Schema({
  username: String,
  passwordDigest: String,
  sessionDigests: [String]
});

var User = Promise.promisifyAll(db.model('User', UserSchema));
Promise.promisifyAll(User.prototype);

exports.User = User;
