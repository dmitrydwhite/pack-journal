'use strict';

App.TripDeleteRoute = Ember.Route.extend({
  afterModel: function(trip) {
    console.log(Ember.inspect(trip));
    trip.deleteRecord();
    trip.save()
    .then(function() {
      this.transtionTo('trips');
    }.bind(this));
  },

  model: function() {
    return this.modelFor('trip');
  }

});