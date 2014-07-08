'use strict';

describe('app', function() {
  it('displays a map from mapbox', function(done) {
    visit('/');
    andThen(function() {
      expect(find('#map').children().first().hasClass('leaflet-map-pane')).to.be.true;
      done();

      // TODO: figure out how to make sure this async operation has completed
      // expect(find('.leaflet-tile-container').last().children().first().prop('tagName'))
      //   .to.eql('img');
    });
  });
});
