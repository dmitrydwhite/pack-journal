'use strict';

App.LogoutRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    var self = this;
    var session = this.get('session');
    return session.invalidate().finally(function() {
      self.store.unloadAll('trip');
      self.transitionTo('application');
    });
  }
});
