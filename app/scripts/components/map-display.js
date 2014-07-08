'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  didInsertElement: function() {
    this._super();
    L.mapbox.map('map',
      Ember.config.MAPKEY)
      .setView(Ember.config.center, Ember.config.zoom);
  }
});