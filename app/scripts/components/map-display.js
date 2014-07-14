'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  map: undefined,

  routeLine: undefined,

  createRoute: function(e) {
    var addedPoints = e.layer.getLatLngs().map(function(point) {
      return { lat: point.lat, lng: point.lng };
    });

    this.set('waypoints', addedPoints);
  },

  didInsertElement: function() {
    this._super();
    this.set('map', L.mapbox.map('map', Ember.config.MAPKEY));

    this.drawTrip();

    var featureGroup;
    if (this.get('mode') === 'edit') {
      featureGroup = L.featureGroup().addTo(this.get('map'));

      new L.Control.Draw({
        edit: {
          featureGroup: featureGroup
        },

        draw: {
          polygon: false,
          polyline: true,
          rectangle: false,
          circle: false,
          marker: false
        }
      }).addTo(this.get('map'));
    }

    this.get('map').on('draw:created', function(e) { this.createRoute(e); }.bind(this) );
  },

  drawTrip: function() {
    var routePoints = [];
    var defaultBounds = [[45.2, -122.9],[45.9,-122.3]];

    if(this.get('waypoints') && this.get('waypoints').length > 0) {
      this.get('waypoints').forEach(function(point) {
        routePoints.push([point.lat, point.lng]);
      });
      this.set('routeLine',
        L.polyline(routePoints, { color: '#F99' }).addTo(this.get('map')));
      this.get('map').fitBounds(this.get('routeLine').getBounds());
    } else {
      this.get('map').fitBounds(defaultBounds);
    }
  },

  waypointsDidChange: function() {
    if(this.get('routeLine')) {
      this.get('map').removeLayer(this.get('routeLine'));
    }
    this.drawTrip();
  }.observes('waypoints')
});
