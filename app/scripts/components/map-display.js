'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  map: undefined,

  routeLine: undefined,

  textMarkers: undefined,

  routeDrawing: undefined,

  textDrawing: undefined,

  createRoute: function(e) {
    var addedPoints = e.layer.getLatLngs().map(function(point) {
      return { lat: point.lat, lng: point.lng };
    });

    this.set('waypoints', addedPoints);
  },

  createTextAnnotation: function(e) {
    var addedPoint = {
      lat: e.layer.getLatLng().lat,
      lng: e.layer.getLatLng().lng
    };
    // Nasty hack because ember data won't creat a record with empy array
    if(this.get('textAnnotations') === undefined) { this.set('textAnnotations', []); }
    this.get('textAnnotations').push(addedPoint);
  },

  editRoute: function() {
    var routeFeatureGroup = L.featureGroup().addTo(this.get('map'));
    if(this.get('textDrawing')) {
      this.get('textDrawing').removeFrom(this.get('map'));
    }
    this.get('map').off('draw:created');

    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: routeFeatureGroup
      },

      draw: {
        polygon: false,
        polyline: true,
        rectangle: false,
        circle: false,
        marker: false
      }
    });

    drawControl.addTo(this.get('map'));
    this.set('routeDrawing', drawControl);

    this.get('map').on('draw:created', function(e) {
      this.createRoute(e);
    }.bind(this));

  },

  editTextAnnotations: function() {
    var textFeatureGroup = L.featureGroup().addTo(this.get('map'));
    if(this.get('routeDrawing')) {
      this.get('routeDrawing').removeFrom(this.get('map'));
    }
    this.get('map').off('draw:created');

    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: textFeatureGroup
      },

      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: true
      }
    });
    drawControl.addTo(this.get('map'));
    this.set('textDrawing', drawControl);

    this.get('map').on('draw:created', function(e) {
      this.createTextAnnotation(e);
    }.bind(this));
  },

  didInsertElement: function() {
    this._super();
    this.set('map', L.mapbox.map('map', Ember.config.MAPKEY));

    this.drawTrip();
  },

  drawTrip: function() {
    this.drawRoute();
    this.drawTextMarkers();

    if (this.get('editMode') === 'editRoute') { this.editRoute(); }
    else if(this.get('editMode') === 'editTextAnnotations') { this.editTextAnnotations(); }
  },

  drawRoute: function() {
    console.log('here');
    var defaultBounds = [[45.2, -122.9],[45.9,-122.3]];
    var routePoints = [];
    if(this.get('waypoints') && this.get('waypoints').length > 0) {
      this.get('waypoints').forEach(function(point) {
        routePoints.push([point.lat, point.lng]);
      });
      this.set('routeLine',
        L.polyline(routePoints, { color: '#142' }).addTo(this.get('map')));
      this.get('map').fitBounds(this.get('routeLine').getBounds());
    } else {
      this.get('map').fitBounds(defaultBounds);
    }
  },

  drawTextMarkers: function() {
    var textPoints = [];
    if(this.get('textAnnotations') && this.get('textAnnotations').length > 0) {
      this.get('textAnnotations').forEach(function(point) {
        textPoints.push([point.lat, point.lng]);
        L.marker(point).addTo(this.get('map'));
      });
    }
  },

  mapDidChange: function() {
    if(this.get('routeLine')) {
      this.get('map').removeLayer(this.get('routeLine'));
    }
    this.drawTrip();
  }.observes('waypoints', 'editMode')
});
