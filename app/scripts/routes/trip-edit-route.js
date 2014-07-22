'use strict';

App.TripEditRoute = Ember.Route.extend({
  actions: {
    saveTrip: function(params) {
      var self = this;
      console.log(params);
      var trip = {
        id: this.get('controller.id'),
        name: this.get('controller.name'),
        waypoints: this.get('controller.waypoints'),
        textAnnotations: this.get('controller.textAnnotations')
      };
      this.store.update('trip', trip)
      .then(function(record) {
        record.save();
      })
      .then(function() {
        self.transitionTo('trips');
      })
      .catch(function(err) {
        console.log(err);
      }) ;
    },

    addTextAnnotation: function() {
      this.controller.set('editMode', 'editTextAnnotations');
    }
  },

  renderTemplate: function() {
    this.render('map/edit', {
      outlet: 'map',
      into: 'main'
    });
    this.render('editcard', {
      outlet: 'sidebar',
      into: 'main'
    });
  },

  model: function() {
    return this.modelFor('trip');
  }

});
