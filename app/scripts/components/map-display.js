'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  map: undefined,

  routeLine: undefined,

  textMarkers: undefined,

  routeDrawing: undefined,

  textDrawing: undefined,

  tripFeatures: undefined,

  controlFeature: function(e) {
    console.log(e.layerType);
    if (e.layerType === 'polyline') {this.addLine(e);}

    if (e.layerType === 'marker') {this.addMarker(e);}

  },

  addLine: function(e) {
    console.log('Adding Line ' + e.layer.getLatLngs());
    var waypointsHelper = (this.get('waypoints') === undefined) ? [] : this.get('waypoints');
    waypointsHelper.push(e.layer.getLatLngs());
    console.log('waypoints Helper: ' + waypointsHelper);
    this.set('waypoints', waypointsHelper);
    console.log('setting waypoints to: ' + this.get('waypoints'));
    this.drawRoute();
  },

  addMarker: function(e) {
    console.log('Adding Marker at ' + e.layer.getLatLng());
    this.get('textAnnotations').push(e.layer.getLatLng());
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

  // Refactoring to see if we can just edit all the features in one function
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
      console.log(e.layer);
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
    this.drawTextMarkers();

    if (this.get('editMode') === 'editRoute') { this.editTrip(); }
    else if(this.get('editMode') === 'editTextAnnotations') { this.editTextAnnotations(); }
  },

  drawRoute: function() {
    console.log('drawing route');
    var defaultBounds = [[45.2, -122.9],[45.9,-122.3]];
    var allRoutes = [];
    if(this.get('waypoints') && this.get('waypoints').length > 0) {
      this.get('waypoints').forEach(function(point) {
          console.log(point);
          L.polyline(point, { color: '#142' }).addTo(this.get('map'));
          allRoutes.push(point);
      }.bind(this));
      this.get('map').fitBounds(allRoutes).getBounds();
    } else {
      this.get('map').fitBounds(defaultBounds);
    }
  },

  drawTextMarkers: function() {
    console.log('drawing text markers');
    var textPoints = [];
    if (this.get('textAnnotations') && this.get('textAnnotations').length > 0) {
      this.get('textAnnotations').forEach(function(point) {
        console.log(point);
        // textPoints.push([point.lat, point.lng]);
        // L.marker(point).addTo(this.get('map'));
      });
    }
  },

  mapDidChange: function() {
    if(this.get('tripFeatures')) {
      this.get('map').removeLayer(this.get('tripFeatures'));
    }
    this.drawTrip();
  }.observes('waypoints', 'editMode')
});
