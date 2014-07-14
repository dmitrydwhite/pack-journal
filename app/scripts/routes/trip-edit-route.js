'use strict';

App.TripEditRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('map/default', {
      outlet: 'map',
      into: 'main'
    });
    this.render('editcard', {
      outlet: 'sidebar',
      into: 'main'
    });
  },

  model: function(params) {
    return this.store.find('trip', { id: params.id });
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
