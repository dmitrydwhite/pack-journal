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

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

//Routing
Ember.Router.map(function () {
  this.resource('trips', {path: '/'});
});

App.TripsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('trip');
  },
  renderTemplate: function() {
    this.render({ outlet: 'tripBar' });
  }
});


