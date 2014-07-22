'use strict';

App.TripsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('trip');
  },

  renderTemplate: function() {
    this.render('application');
    this.render('main', {
      into: 'application'
    });
    this.render('map/default', {
      outlet: 'map',
      into: 'main'
    });
    this.render('tripcards', {
      outlet: 'sidebar',
      into: 'main'
    });

  }
});
