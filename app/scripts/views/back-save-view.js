'use strict';

App.BackSaveView = Ember.View.extend({
  click: function(evt) {
    this.get('controller').send('backSave');
  }
});
