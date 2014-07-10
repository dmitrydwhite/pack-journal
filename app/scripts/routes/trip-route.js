'use strict';

App.TripRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('trip', params.id);
  }
});