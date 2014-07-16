var Schema = db.Schema;

var UserSchema = new Schema({
  username: String,
  passwordDigest: String,
  sessionDigests: [String]
});

exports.User = db.model('User', UserSchema);
