'use strict';

App.SignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('user');
  },

  actions: {
    signup: function() {
      var session = this.get('session');
      var self = this;

      this.set('error', undefined);
      this.currentModel.save() // create the user
      .then(function() {
        session.login({ username: self.get('model.username') });
        self.transitionToRoute('trips');
      })
      .catch(function(error) {
        if (error.responseJSON) { error = error.responseJSON; }
        if (error.error) { error = error.error; }
        self.set('error', error);
      });
    }
  }
});