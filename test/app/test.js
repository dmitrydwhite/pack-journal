'use strict';

var tripFixture = __fixture('trip-fixture');
var mapBoxFixture = __fixture('mapbox-fixture');

describe('app', function() {
  before(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
  });

  after(function() {
    this.server.restore();
  });

  beforeEach(function() {
    App.reset();
  });

  it('displays a map from mapbox', function(done) {
    // Set up Fake Server responses
    this.server.respondWith('GET',
      tripFixture.url,
      [200, { 'Content-Type': 'application/json' },
      JSON.stringify(tripFixture.getManyData)]);

    this.server.respondWith('GET',
      mapBoxFixture.request.url,
      [200, { 'Content-Type': 'application/json' },
      JSON.stringify(mapBoxFixture.response)]);

    //Perform actual test
    visit('/trips');
    andThen(function() {
      expect(find('#map').children().first().hasClass('leaflet-map-pane')).to.be.true;
      done();

      // TODO: figure out how to make sure this async operation has completed
      // expect(find('.leaflet-tile-container').last().children().first().prop('tagName'))
      //   .to.eql('img');
    });
  });

  // TODO: implement test to make sure we are rendering the trip cards
});
