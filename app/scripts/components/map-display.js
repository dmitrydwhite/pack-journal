'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  map: undefined,

  routeLine: undefined,

  textMarkers: undefined,

  routeDrawing: undefined,

  textDrawing: undefined,

  tripFeatures: undefined,

  controlFeature: function(e) {
    if (e.layerType === 'polyline') {this.addLine(e);}

    if (e.layerType === 'marker') {this.addMarker(e);}

  },

  addLine: function(e) {
    var waypointsHelper = (this.get('waypoints') === undefined) ? [] : this.get('waypoints');
    waypointsHelper.push(e.layer.getLatLngs());
    this.set('waypoints', waypointsHelper);
    this.drawRoute();
  },

  addMarker: function(e) {
    var markerHelper = (this.get('textAnnotations') === undefined) ? [] : this.get('textAnnotations');
    markerHelper.push(e.layer.getLatLng());
    this.set('textAnnotations', markerHelper);
    this.drawRoute();
  },

  editTrip: function() {
    this.set('tripFeatures', new L.featureGroup().addTo(this.get('map')));

    if (this.get('routeDrawing') === undefined) {
      var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: this.get('tripFeatures')
        },

        draw: {
          polygon: false,
          polyline: true,
          rectangle: false,
          circle: false,
          marker: true
        }
      }).addTo(this.get('map'));

        this.set('routeDrawing', drawControl);
    }

    this.get('map').on('draw:created', function(e) {
      this.get('tripFeatures').addLayer(e.layer);
      this.controlFeature(e);
    }.bind(this));

  },

  didInsertElement: function() {
    this._super();
    this.set('map', L.mapbox.map('map', Ember.config.MAPKEY));
    this.drawTrip();
  },

  drawTrip: function() {
    this.drawRoute();

    if (this.get('editMode') === 'editRoute') { this.editTrip(); }
    else if(this.get('editMode') === 'editTextAnnotations') { this.editTextAnnotations(); }
  },

  drawRoute: function() {
    var defaultBounds = [[45.2, -122.9],[45.9,-122.3]];
    var allRoutes = [];
    if(this.get('waypoints') && this.get('waypoints').length > 0) {
      this.get('waypoints').forEach(function(point) {
          L.polyline(point, { color: '#142' }).addTo(this.get('map'));
          allRoutes.push(point);
      }.bind(this));
      this.get('map').fitBounds(allRoutes).getBounds();
    } else {
      this.get('map').fitBounds(defaultBounds);
    }
    if (this.get('textAnnotations') && this.get('textAnnotations').length > 0) {
      this.get('textAnnotations').forEach(function(point) {
        L.marker(point, {
          'marker-size': 'small',
          'marker-color': '#142'}).addTo(this.get('map'));
      }.bind(this));
    }
  },

  mapDidChange: function() {
    if(this.get('tripFeatures')) {
      this.get('map').removeLayer(this.get('tripFeatures'));
    }
    this.drawTrip();
  }.observes('waypoints', 'editMode')
});
