'use strict';

App.TripsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('trip');
  },
  renderTemplate: function() {
    this.render({ outlet: 'tripBar' });
  }
});