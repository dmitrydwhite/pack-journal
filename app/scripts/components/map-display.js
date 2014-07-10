'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  didInsertElement: function() {
    this._super();
    var map = L.mapbox.map('map', Ember.config.MAPKEY)
      .setView(Ember.config.center, Ember.config.zoom);

    var linePoints = [];
    if(this.get('waypoints')) {
      this.get('waypoints').forEach(function(point) {
        linePoints.push([point.latitude, point.longitude]);
      });
      L.polyline(linePoints, { color: '#F99' }).addTo(map);
    }
  }
});