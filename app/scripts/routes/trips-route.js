'use strict';

App.TripsRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated') === false) {
      this.transitionTo('login');
    }
  },

  setupController: function(controller, model) {
    controller.set('ghostCenter', undefined);
    controller.set('model', model);
  },

  model: function() {
    return this.store.find('trip');
  },

  renderTemplate: function() {
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
