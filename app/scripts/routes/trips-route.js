'use strict';

App.TripsRoute = Ember.Route.extend({
  model: function() {
    console.log('In Trips Model');
    return this.store.find('trip');
  },

  renderTemplate: function() {
    console.log('In Trips Render');
    this.render('main');
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
