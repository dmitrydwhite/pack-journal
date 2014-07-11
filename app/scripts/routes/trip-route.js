'use strict';

App.TripRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('trip', params.id);
  },

  renderTemplate: function() {
    this.render('map/detail', {
      outlet: 'map',
      into: 'main'
    });
    this.render('tripcards', {
      outlet: 'sidebar',
      into: 'main',
      controller: 'trips'
    });
  }
});