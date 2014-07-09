var Schema = db.Schema;

var TripSchema = new Schema({
  name: String
});

exports.Trip = db.model('Trip', TripSchema);
