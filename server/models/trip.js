'use strict';

module.exports = (function() {
  var Promise = require('bluebird');

  var WaypointSchema = new db.Schema({
    lat: Number,
    lng: Number
  }, { id: false, _id: false });

  var TripSchema = new db.Schema({
    name: String,
    owner: { type: db.Schema.Types.ObjectId, ref: 'User' },
    features: {
      waypoints: [ WaypointSchema ]
    }
  });

  var Trip = Promise.promisifyAll(db.model('Trip', TripSchema));
  Promise.promisifyAll(Trip.prototype);

  return { Trip: Trip };
})();