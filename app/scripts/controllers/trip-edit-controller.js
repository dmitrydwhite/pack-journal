'use strict';

App.TripEditController = Ember.ObjectController.extend({
  editMode: 'editRoute',

  editAnnotationIndex: undefined,

  displayedText: function() {
    console.log('in displayed text');
    console.log(this.get('textAnnotations')[this.get('editAnnotationIndex')].text);
    return this.get('textAnnotations')[this.get('editAnnotationIndex')].text;
  }.property('editAnnotationIndex'),
  

  updateModelWithText: function() {
    console.log('in update model with text. dislayedText: ', this.get('displayedText'));
    var textAnnotations = this.get('textAnnotations');
    textAnnotations[this.get('editAnnotationIndex')].text = this.get('displayedText');
    this.set('textAnnotations', textAnnotations);
  }.observes('displayedText')

});