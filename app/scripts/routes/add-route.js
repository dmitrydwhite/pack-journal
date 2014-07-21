'use strict';

App.AddRoute = Ember.Route.extend({

  renderTemplate: function() {
    this.render('main');
    this.render('map/default', {
      outlet: 'map',
      into: 'main'
    });
    this.render('addcard', {
      outlet: 'sidebar',
      into: 'main'
    });
  },

  actions: {
    saveTrip: function() {
      var trip = this.store.createRecord('trip', {
        name: this.get('controller.name'),
        waypoints: [],
        textAnnotations: []
      });
      trip.save()
      .then(function(record) {
        console.log('just saved trip ' + record.name);
        this.transitionTo('trip.edit', record);
      }.bind(this));
      // this.set('controller.name', undefined);
    }
  }
});
