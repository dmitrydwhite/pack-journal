'use strict';

App.TripEditRoute = Ember.Route.extend({
  renderTemplate: function() {
    console.log('in edit route');
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
    console.log(params);
    return this.store.find('trip', params.id);
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
