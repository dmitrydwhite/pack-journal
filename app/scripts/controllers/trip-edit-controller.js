'use strict';

App.TripEditController = Ember.ObjectController.extend({
  editMode: 'editRoute',

  editAnnotationIndex: undefined,

  displayedText: function(key, value, previousValue) {
    //setter
    if(arguments.length > 1) {
      var textAnnotations = this.get('textAnnotations');
      textAnnotations[this.get('editAnnotationIndex')].text = value;
      this.set('textAnnotations', textAnnotations);
    }

    //getter
    if(this.get('editAnnotationIndex') !== undefined) {
      return this.get('textAnnotations')[this.get('editAnnotationIndex')].text;
    }
  }.property('editAnnotationIndex'),

});