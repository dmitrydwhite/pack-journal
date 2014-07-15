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
require('./models/user-model');
require('./router');
require('./routes/trips-route');
require('./routes/trip-route');
require('./routes/trips-add-route');
require('./routes/trip-edit-route');
require('./routes/trip-delete-route');
require('./adapters');
