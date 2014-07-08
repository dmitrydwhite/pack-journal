'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  didInsertElement: function() {
    this._super();
    console.log('made it here');
    L.mapbox.map('map',
      Ember.config.MAPKEY)
      .setView(Ember.config.center, Ember.config.zoom);
  }
});