'use strict';

Ember.Router.map(function () {
  this.resource('trips', { path: '/' }, function() {
    this.route('add', { path: '/add' });
    this.resource('trip', { path: 'trips/:id' }, function() {
      this.route('index', { path: '/' });
      this.route('edit', { path: '/edit' });
    });
  });
});
