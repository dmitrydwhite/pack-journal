var Schema = db.Schema;

var TripSchema = new Schema({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  features: {
    waypoints: [ Schema.Types.Mixed ]
  }
});

exports.Trip = db.model('Trip', TripSchema);
