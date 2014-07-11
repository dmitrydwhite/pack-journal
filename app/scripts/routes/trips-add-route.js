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

      var trip = this.store.createRecord('trip', {
        name: this.get('controller.name')
      });
      console.log(trip);
      // trip.save();   // Save this for later, serialization issues
      this.transitionTo('trip.edit', this);
    }
  }
});
