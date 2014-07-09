'use strict';

window.App = Ember.Application.create();

// Set config params for the mapbox component
Ember.config = {
  MAPKEY: 'athorak.ile4f80n',
  center: [45.46, -122.7],
  zoom: 8
};

require('./components/map-display.js');

App.ApplicationAdapter = Ember.RESTAdapter.extend({
  namespace: 'api'
});

// Routing

// Ember.Router.map(function () {
//   this.resource('api', {path: '/api'}, function () {
//     this.resource('trips', {path: '/trips'});
// });
// });
