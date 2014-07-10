'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  didInsertElement: function() {
    this._super();

    var linePoints = [];
    var minLat = -90,
        maxLat = 90,
        minLong = -180,
        maxLong = 180;

    if(this.get('waypoints')) {
      this.get('waypoints').forEach(function(point) {
        minLat  = point.latitude  > minLat  ? point.latitude  : minLat;
        minLong = point.longitude > minLong  ? point.longitude : minLong;
        maxLat  = point.latitude  < maxLat  ? point.latitude  : maxLat;
        maxLong = point.longitude  < maxLong ? point.longitude  : maxLong;

        linePoints.push([point.latitude, point.longitude]);
      });
    } else {
      minLat = 45.2;
      minLong = -122.9;
      maxLat = 45.9;
      maxLong = -122.3;
    }

    var map = L.mapbox.map('map', Ember.config.MAPKEY);
      // .setView(Ember.config.center, Ember.config.zoom);

    var southWest = L.latLng(minLat, minLong);
    var northEast = L.latLng(maxLat, maxLong);
    var bounds = L.latLngBounds(southWest, northEast);
    console.log(bounds);
    map.fitBounds(bounds);

    if(this.get('waypoints')) {
      L.polyline(linePoints, { color: '#F99' }).addTo(map);
    }
  }
});