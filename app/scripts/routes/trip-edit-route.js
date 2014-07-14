'use strict';

App.TripEditRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('map/edit', {
      outlet: 'map',
      into: 'main'
    });
    this.render('editcard', {
      outlet: 'sidebar',
      into: 'main'
    });
  },

  model: function() {
    return this.modelFor('trip');
  }

  // actions: {
  //   saveTrip: function() {
  //     var trip = this.store.createRecord('trip', {
  //       name: this.get('controller.name')
  //     });
  //     trip.save()
  //     .then(function(record) {
  //       this.transitionTo('trip.edit', record);
  //     }.bind(this));
  //   }
  // }
});
