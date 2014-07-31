'use strict';

App.MapDisplayComponent = Ember.Component.extend({

  // Define variables to be used locally on the Component:
  map: undefined,

  ghostCenter: undefined,

  textMarkers: undefined,

  routeDrawing: undefined,

  geoJSON: undefined,

  featureLayer: undefined,

  clickHandlerRegistered: false,

  // Set up Event Listeners & draw initial map features once each time map loads
  didInsertElement: function() {
    console.log('did insert element');
    this.set('map', L.mapbox.map('map', Ember.config.MAPKEY));
    this.setGeoJSON();
    this.drawTrip();

    this.get('map').on('draw:created', function(e) {
      this.addElement(e);
    }.bind(this));

    this.get('map').on('draw:edited', function(e) {
      this.editElement(e);
    }.bind(this));

    // TODO: Enable deleting markers and lines

    this.get('map').on('viewreset', function(e) {
      console.log(e.target.getCenter());
      console.log(e.target.getZoom());
      if (!this.get('featureLayer')) {
        var draw = e.target.getCenter();
        var ghostCenter = [draw.lat, draw.lng];
        this.set('ghostCenter', ghostCenter);
      }
    }.bind(this));
  },

  // Convert stored model data to GeoJSON format
  setGeoJSON: function() {
    var geoJSON = [];
    var waypoints = this.get('waypoints');
    var textAnnotations = this.get('textAnnotations');
    var coordinates;
    var idCounter = 0;

    // Transform waypoints property into geoJSON format
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

    // Transform textAnnotations property into GeoJSON format
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

  // Add a newly drawn element to the data model and to the controller's GeoJSON,
  //    re-draw the map
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

  // Replace all the recently edited layers in the component's GeoJSON hash,
  //    update the data models with the new GeoJSON hash, then re-draw the map
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

  setBounds: function(featureLayer) {
    console.log('setting bounds with ghost Center: ' + this.get('ghostCenter'));
    var defaultBounds = [[45.2, -122.9],[45.9,-122.3]];
    if(featureLayer) {
      console.log('there is a feature layer');
      var bounds = featureLayer.getBounds();
      var center = bounds.getCenter();
      var sw = bounds.getSouthWest();
      var ne = bounds.getNorthEast();
      console.log(sw.lng-ne.lng);
      console.log(ne.lat-sw.lat);
      var tooSmall = sw.lng - ne.lng < 0.0125 && ne.lat - sw.lat < 0.0125 ? true : false;
      console.log(tooSmall);
      if (tooSmall) {this.get('map').setView(center, 13);}
      else {this.get('map').fitBounds(featureLayer);}
    } else
    if (this.get('ghostCenter')) {
      console.log('there is a ghost center');
      this.get('map').setView(this.get('ghostCenter'), 12);
    }
    else {
      this.get('map').fitBounds(defaultBounds);
    }
  },

  registerClickHandler: function() {
    if( !this.get('clickHandlerRegistered') ) {
      this.set('clickHandlerRegistered', (function() {
        this.get('featureLayer').on('click', function(e) {
          this.set('editAnnotationIndex', e.layer.toGeoJSON().properties.id - this.get('waypoints').length);
          console.log('clicked' + this.get('editAnnotationIndex'));
        }.bind(this));
      }.bind(this))());
    }
  },

  drawTrip: function() {
    console.log('made it in drawtrip');
    if(this.get('featureLayer')) {
      console.log('there is a feature layer');
      this.get('map').removeLayer(this.get('featureLayer'));
    }
    if(this.get('geoJSON').length > 0) {
      console.log('there is GeoJSON');
      this.set('featureLayer', L.mapbox.featureLayer(this.get('geoJSON')).addTo(this.get('map')));
      this.setBounds(this.get('featureLayer'));
      this.registerClickHandler();
      console.log(this.get('clickHandlerRegistered'));
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
