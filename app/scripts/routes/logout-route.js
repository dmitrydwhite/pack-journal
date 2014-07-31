'use strict';

App.LogoutRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    var self = this;
    var session = this.get('session');
    return session.invalidate().finally(function() {
      self.store.unloadAll('trip');
      // self.transitionTo('application');
    });
  },

  renderTemplate: function() {
    this.render('application.index', {
      into: 'main',
      outlet: 'sidebar'
    });
    this.render('covermap', {
      into: 'main',
      outlet: 'map'
    });
  }
});
