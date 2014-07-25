'use strict';

App.TripEditRoute = Ember.Route.extend({
  actions: {
    saveTrip: function() {
      this.currentModel.save()
      .then(function() {
        console.log('saved!');
      });
    },
  },

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

});
