'use strict';

window.App = Ember.Application.create();

// Set config params for the mapbox component
Ember.config = {
  MAPKEY: 'athorak.ile4f80n',
  center: [45.46, -122.7],
  zoom: 8
};

require('./components/map-display.js');
require('./models/trip');
require('./router');
require('./routes/tripsRoute');

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});
