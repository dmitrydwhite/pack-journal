'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var _ = require('lodash');
var favicon = require('serve-favicon');
var config = require('./config');

var app = express();
var config = require('./config');

var db = require('mongoose');

db.connect(config.db.connection);

// Model definitions

var Schema = db.Schema;
var TripSchema = new Schema({
  name: String
});
var Trip = db.model('Trip', TripSchema);

if (config.env === 'development') {
  var connectLivereload = require('connect-livereload');
  app.use(connectLivereload({ port: process.env.LIVERELOAD_PORT || 35729 }));
  app.use(morgan('dev'));
  app.use(express.static(config.public));
  app.use(express.static(path.join(__dirname, '../app')));
}
if (config.env === 'production') {
  app.use(morgan('default'));
  app.use(favicon(path.join(config.public, 'favicon.ico')));
  app.use(express.static(config.public));
  app.use(compression());
}
app.use(bodyParser.json());
app.use(methodOverride());

var api = express.Router();

api.get('/trips', function(req, res) {
  Trip.find(function(err, docs) {
    // TODO: Error handling generally
    // TODO: Map the doc to remove unwanted db info
    var tripsRes = { trips: docs };
    res.send(tripsRes);
  });
});

app.use('/api', api);

// expose app
module.exports = app;

// start server
if (require.main === module) {
  app.listen(config.port, function() {
    return console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}
