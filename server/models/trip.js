var Schema = db.Schema;

var TripSchema = new Schema({
  name: String,
  features: {
    waypoints: [ Schema.Types.Mixed ]
  }
});

exports.Trip = db.model('Trip', TripSchema);
