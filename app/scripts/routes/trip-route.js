'use strict';

App.TripRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated') === false) {
      this.transitionTo('application');
    }
  },

  model: function(params) {
    return this.store.find('trip', params.id);
  },

  renderTemplate: function() {
    this.render('application');
    this.render('main', {
      into: 'application'
    });
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
