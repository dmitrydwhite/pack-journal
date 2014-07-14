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
      var trip = this.store.createRecord('trip', {
        name: this.get('controller.name')
      });
      trip.save()
      .then(function(record) {
        this.transitionTo('trip.edit', record);
      }.bind(this));
    }
  }
});
