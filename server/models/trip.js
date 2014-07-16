'use strict';

module.exports = (function() {
  var Promise = require('bluebird');

  var TripSchema = new db.Schema({
    name: String,
    owner: { type: db.Schema.Types.ObjectId, ref: 'User' },
    features: {
      waypoints: [ db.Schema.Types.Mixed ]
    }
  });

  var Trip = Promise.promisifyAll(db.model('Trip', TripSchema));
  Promise.promisifyAll(Trip.prototype);

  return { Trip: Trip };
})();