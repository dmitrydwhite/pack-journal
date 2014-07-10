'use strict';

window.App = Ember.Application.create();

// Set config params for the mapbox component
Ember.config = {
  MAPKEY: 'athorak.ile4f80n',
  center: [45.46, -122.7],
  zoom: 8
};

require('./components/map-display.js');
require('./models/trip-model');
require('./router');
require('./routes/trips-route');

App.TripAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

App.TripSerializer = DS.RESTSerializer.extend({
  extractArray: function(store, type, payload) {
    console.log(payload);

    payload.trips.forEach(function(trip) {
      trip.waypoints = trip.features.waypoints;
      delete trip.features;
    });

    return this._super(store, type, payload);
  }
});
