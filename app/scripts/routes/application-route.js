'use strict';

App.ApplicationRoute = Ember.Route.extend({
  renderTemplate: function() {
      this.render('application');
      this.render('main', {
        into: 'application'
      });
      this.render('application.index', {
        outlet: 'sidebar',
        into: 'main'
      });
  }
});
