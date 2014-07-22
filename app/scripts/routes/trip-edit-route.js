'use strict';

App.TripEditRoute = Ember.Route.extend({
  actions: {
    saveTrip: function() {
      var self = this;
      this.currentModel.save()
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
