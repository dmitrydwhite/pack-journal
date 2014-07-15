'use strict';

App.SignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('user');
  },

  actions: {
    signup: function() {
      var session = this.get('session');
      var self = this;

      this.controller.set('error', undefined);
      this.currentModel.save() // create the user
      .then(function() {
        session.login({ username: self.get('model.username') });
        self.transitionTo('trips');
      })
      .catch(function(error) {
        if (error.responseJSON) { error = error.responseJSON; }
        if (error.error) { error = error.error; }
        self.controller.set('error', error);
      });
    }
  }
});