'use strict';

Ember.Router.map(function () {
  this.resource('application', { path: '/'}, function() {
    this.route('signup', { path: '/signup' });
    this.route('login', { path: '/login' });
    this.route('logout', { path: '/logout' });
    this.route('trips', { path: '/trips' });
    this.route('add', { path: '/add' });
    this.resource('trip', { path: 'trip/:id' }, function() {
      this.route('index', { path: '/' });
      this.route('edit', { path: '/edit' });
      this.route('delete', { path: '/delete' });
      });
    });
});
