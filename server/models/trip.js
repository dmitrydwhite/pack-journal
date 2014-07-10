var Schema = db.Schema;

var TripSchema = new Schema({
  name: String,
  features: {
    waypoints: [ Schema.Types.Array ]
  }
});

exports.Trip = db.model('Trip', TripSchema);
