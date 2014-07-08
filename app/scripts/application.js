'use strict';

window.App = Ember.Application.create();

// Set config params for the mapbox component
Ember.config = {
  MAPKEY: 'athorak.ile4f80n',
  center: [42.35, -122],
  zoom: 15
};

require('./components/map-display.js');
