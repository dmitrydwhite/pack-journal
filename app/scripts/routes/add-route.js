'use strict';

App.AddRoute = Ember.Route.extend({

  renderTemplate: function() {
    this.render('application');
    this.render('main', {
      into: 'application'
    });
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
        name: this.get('controller.name')
      });
      trip.save()
      .then(function(record) {
        this.transitionTo('trip.edit', record);
      }.bind(this));
      this.set('controller.name', undefined);
    }
  }
});
