'use strict';

App.TripAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

App.UserAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

App.TripSerializer = DS.RESTSerializer.extend({
  extractArray: function(store, type, payload) {
    payload.trips.forEach(function(trip) {
      trip.waypoints = trip.features.waypoints;
      trip.textAnnotations = trip.features.textAnnotations;
      trip.ghostCenter = trip.features.ghostCenter;
      delete trip.features;
    });

    return this._super(store, type, payload);
  },

  extractSave: function(store, type, payload) {
    payload.trip.waypoints = payload.trip.features.waypoints;
    payload.trip.textAnnotations = payload.trip.features.textAnnotations;
    payload.trip.ghostCenter = payload.trip.features.ghostCenter;
    delete payload.trip.features;
    return this._super(store, type, payload);
  },

  extractFind: function(store, type, payload) {
    payload.trip.waypoints = payload.trip.features.waypoints;
    payload.trip.textAnnotations = payload.trip.features.textAnnotations;
    payload.trip.ghostCenter = payload.trip.features.ghostCenter;
    delete payload.trip.features;
    return this._super(store, type, payload);
  },

  serialize: function(trip) {
    var json = {
      name: trip.get('name'),
      features: {
        waypoints: trip.get('waypoints'),
        textAnnotations: trip.get('textAnnotations'),
        ghostCenter: trip.get('ghostCenter')
      }
    };

    return json;
  }
});
