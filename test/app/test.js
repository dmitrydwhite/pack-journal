'use strict';

describe('app', function() {
  before(function() {
    this.getTripsFixture = __fixture('get-trips');
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
    // Set up Fake Server response
    this.server.respondWith(this.getTripsFixture.request.method,
      this.getTripsFixture.request.url,
      [200, { 'Content-Type': 'application/json' },
      JSON.stringify(this.getTripsFixture.response)]);

    //Perform actual test
    visit('/');
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
