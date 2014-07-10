'use strict';

Ember.Router.map(function () {
  this.resource('trips', { path: '/' }, function() {
    this.resource('trip', { path: 'trips/:id' }, function() {
      this.route('index', { path: '/' });
    });
  });
});