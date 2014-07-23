'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  map: undefined,

  textMarkers: undefined,

  routeDrawing: undefined,

  geoJSON: undefined,

  featureLayer: undefined,

  setGeoJSON: function() {
    var geoJSON = [];
    var waypoints = this.get('waypoints');
    var textAnnotations = this.get('textAnnotations');
    var coordinates;

    // Transform waypoints property into geoJSON
    if(waypoints && waypoints.length > 0) {
      waypoints.forEach(function(line) {
        coordinates = line.map(function(point) {
          return [point.lng, point.lat];
        });

        geoJSON.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        });
        coordinates = [];
      });
    }

    if(textAnnotations && textAnnotations.length > 0) {
      textAnnotations.forEach(function(annotation) {
        geoJSON.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [annotation.lng, annotation.lat]
          },
          properties: {
            'marker-color': '#142',
            'marker-size': 'small'
          }
        });
      });
    }

    this.set('geoJSON', geoJSON);
  },

  addElement: function(e) {
    var coordinates;
    var model;
    if(e.layerType === 'polyline') {
      coordinates = e.layer.getLatLngs();
      model = 'waypoints';
    }
    if(e.layerType === 'marker') {
      coordinates = e.layer.getLatLng();
      model = 'textAnnotations';
    }
    var elementHelper = (this.get(model) === undefined) ? [] : this.get(model);
    elementHelper.push(coordinates);
    this.set(model, elementHelper);
    this.drawTrip();
  },

  editTrip: function() {
    if (this.get('routeDrawing') === undefined) {
      var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: this.get('featureLayer')
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
  },

  didInsertElement: function() {
    this.set('map', L.mapbox.map('map', Ember.config.MAPKEY));
    this.drawTrip();

    this.get('map').on('draw:created', function(e) {
      this.addElement(e);
    }.bind(this));
  },

  setBounds: function(featureLayer) {
    var defaultBounds = [[45.2, -122.9],[45.9,-122.3]];
    if(featureLayer) {
      this.get('map').fitBounds(featureLayer.getBounds());
    } else {
      this.get('map').fitBounds(defaultBounds);
    }
  },

  drawTrip: function() {
    if(this.get('featureLayer')) {
      this.get('map').removeLayer(this.get('featureLayer'));
    }
    this.setGeoJSON();
    if(this.get('geoJSON').length > 0) {
      this.set('featureLayer', L.mapbox.featureLayer(this.get('geoJSON')).addTo(this.get('map')));
      this.setBounds(this.get('featureLayer'));
    } else {
      this.setBounds();
    }

    if (this.get('editMode') === 'editRoute') { this.editTrip(); }
  },

  mapDidChange: function() {
    this.drawTrip();
  }.observes('waypoints', 'editMode')
});
