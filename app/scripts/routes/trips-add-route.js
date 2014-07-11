'use strict';

App.TripsAddRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('map/default', {
      outlet: 'map',
      into: 'main'
    });
    this.render('addcard', {
      outlet: 'sidebar',
      into: 'main'
    });
  },

  actions: {
    saveTrip: function() {
      console.log('Yep, save this trip');
      this.transitionTo('trip.edit', this);
    }
  }
});
