'use strict';

App.LoginRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated')) {
      this.transitionTo('trips');
    }
  },

  renderTemplate: function() {
    this.render('application.index', {
      into: 'main',
      outlet: 'sidebar'
    });
    this.render('login', {
      into: 'main',
      outlet: 'map'
    });
  }
});
