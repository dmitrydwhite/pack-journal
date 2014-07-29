'use strict';

App.TripDeleteRoute = Ember.Route.extend({
  afterModel: function(trip) {
    trip.deleteRecord();
    trip.save()
    .then(function() {
      this.replaceWith('trips');
    }.bind(this));
  },

  model: function() {
    return this.modelFor('trip');
  }

});
