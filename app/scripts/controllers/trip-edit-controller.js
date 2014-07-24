'use strict';

App.TripEditController = Ember.ObjectController.extend({
  editMode: 'editRoute',

  editAnnotationIndex: undefined,

  displayedText: function() {
    console.log(this.get('textAnnotations')[this.get('editAnnotationIndex')].text);
    return this.get('textAnnotations')[this.get('editAnnotationIndex')].text;
  }.property('editAnnotationIndex'),

  updateModelWithText: function() {
    var textAnnotations = this.get('textAnnotations');
    textAnnotations[this.get('editAnnotationIndex')].text = this.get('displayedText');
    this.set('textAnnotations', textAnnotations);
  }.observes('displayedText')

});