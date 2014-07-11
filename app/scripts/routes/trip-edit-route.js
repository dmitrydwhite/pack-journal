'use strict';

App.TripEditRoute = Ember.Route.extend({
  renderTemplate: function() {
    console.log('in edit route');
    this.render('map/default', {
      outlet: 'map',
      into: 'main'
    });
    this.render('editcard', {
      outlet: 'sidebar',
      into: 'main'
    });
  }
});
