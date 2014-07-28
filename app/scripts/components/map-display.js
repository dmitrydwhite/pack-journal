'use strict';

App.MapDisplayComponent = Ember.Component.extend({
  map: undefined,

  textMarkers: undefined,

  routeDrawing: undefined,

  geoJSON: undefined,

  featureLayer: undefined,

  clickHandlerRegistered: false,

  setGeoJSON: function() {
    var geoJSON = [];
    var waypoints = this.get('waypoints');
    var textAnnotations = this.get('textAnnotations');
    var coordinates;
    var idCounter = 0;

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
          },
          properties: {
            id: idCounter
          }
        });
        idCounter++;
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
            'marker-size': 'small',
            id: idCounter
          }
        });
        idCounter++;
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
    this.setGeoJSON();
    this.drawTrip();
  },

  editElement: function(e) {
    e.layers.eachLayer(function(layer) {
      var i;
      for(i=0; i<this.geoJSON.length; i++) {
        if(layer.feature.properties.id === this.geoJSON[i].properties.id) {
          this.geoJSON[i] = layer.toGeoJSON();
        }
      }
    }.bind(this));

    var newWaypoints = [];
    var newTextAnnotations = [];
    this.get('geoJSON').forEach(function(feature) {
      if(feature.geometry.type === 'LineString') {
        newWaypoints.push(feature.geometry.coordinates.map(function(point) {
          return { lng: point[0], lat: point[1] };
        }));
      } else if (feature.geometry.type === 'Point') {
        newTextAnnotations.push({
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1]
        });
      }
    });
    this.set('waypoints', newWaypoints);
    this.set('textAnnotations', newTextAnnotations);
    this.setGeoJSON();
    this.drawTrip();
  },

  editTrip: function() {
    var drawControl;
    var featureLayer = this.get('featureLayer') ? this.get('featureLayer') : L.featureGroup();

    if (this.get('routeDrawing') === undefined) {
      drawControl = new L.Control.Draw({
        edit: {
          featureGroup: featureLayer
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
    this.setGeoJSON();
    this.drawTrip();

    this.get('map').on('draw:created', function(e) {
      this.addElement(e);
    }.bind(this));

    this.get('map').on('draw:edited', function(e) {
      this.editElement(e);
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

  registerClickHandler: function() {
    if(!this.get('clickHandlerRegistered')) {
      this.set('clickHandlerRegistered', true);
      this.get('featureLayer').on('click', function(e) {
        console.log('clicked');
        this.set('editAnnotationIndex', e.layer.toGeoJSON().properties.id - this.get('waypoints').length);
        console.log(this.get('editAnnotationIndex'));
        // resetColors();
        // e.layer.feature.properties['old-color'] = e.layer.feature.properties['marker-color'];
        // e.layer.feature.properties['marker-color'] = '#ff8888';
        // myLayer.setGeoJSON(geoJson);
      }.bind(this));
    }
  },

  drawTrip: function() {
    console.log('made it in drawtrip');
    if(this.get('featureLayer')) {
      this.get('map').removeLayer(this.get('featureLayer'));
    }
    if(this.get('geoJSON').length > 0) {
      this.set('featureLayer', L.mapbox.featureLayer(this.get('geoJSON')).addTo(this.get('map')));
      this.setBounds(this.get('featureLayer'));
      this.registerClickHandler();
    } else {
      this.setBounds();
    }

    if (this.get('editMode') === 'editRoute') { this.editTrip(); }
  },

  mapDidChange: function() {
    console.log('in mapDidChange');
    this.setGeoJSON();
    this.drawTrip();
  }.observes('waypoints', 'editMode')
});
