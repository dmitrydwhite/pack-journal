'use strict';

App.AddRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    if (this.get('session').get('isAuthenticated') === false) {
      this.transitionTo('login');
    }
  },

  setupController: function(controller, model) {
    var center = this.controllerFor('trips').get('ghostCenter');
    controller.set('ghostCenter', center);
  },

  renderTemplate: function() {
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
        textAnnotations: [],
        ghostCenter: this.get('controller.ghostCenter')
      });
      trip.save()
      .then(function(record) {
        this.set('controller.name', '');
        this.transitionTo('trip.edit', record);
      }.bind(this));
      // this.set('controller.name', undefined);
    }
  }
});
