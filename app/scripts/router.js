'use strict';

Ember.Router.map(function () {
  this.route('application', { path: '/' });
  this.route('signup', { path: '/signup' });
  this.route('login', { path: '/login' });
  this.route('logout', { path: '/logout' });
  this.resource('trips', { path: '/trips' });
  this.route('add', { path: '/add' });
  this.resource('trip', { path: 'trips/:id' }, function() {
    this.route('index', { path: '/' });
    this.route('edit', { path: '/edit' });
    this.route('delete', { path: '/delete' });
    });
});
