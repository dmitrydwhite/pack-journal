'use strict';

App.TripEditController = Ember.ObjectController.extend({
  editMode: 'editRoute',

  displayEntryBox: function() {
    var display = this.get('editAnnotationIndex') >= 0 ? true : false;
    return display;
  }.property('editAnnotationIndex'),

  // editAnnotationIndex: undefined,

  displayedText: function(key, value, previousValue) {
    var offset = this.get('waypoints').length;

    //setter
    if(arguments.length > 1) {
      var textAnnotations = this.get('textAnnotations');
      textAnnotations[this.get('editAnnotationIndex')-offset].text = value;
      this.set('textAnnotations', textAnnotations);
    }

    //getter
    if(this.get('editAnnotationIndex') !== undefined) {
      if ((this.get('editAnnotationIndex') - offset) < 0) {
        this.set('displayEntryBox', false);
      } else {
        this.set('displayEntryBox', true);
        return this.get('textAnnotations')[this.get('editAnnotationIndex')-offset].text;
      }
    }

  }.property('editAnnotationIndex'),

});
