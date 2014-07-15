'use strict';

var config = require('./config');
if (config.env === 'production') { require('newrelic'); }

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var favicon = require('serve-favicon');
var config = require('./config');

var app = express();


/*
Set up database connection to mongo, including authentication framework
 */
global.db = require('mongoose');
db.connect(config.db.connection);

var admit = require('admit-one')('mongo', {
  mongo: {
    db: config.db.connection
  }
});


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

// Routes for trip API
var tripRoutes = require('./routes/trips');
api.get('/trips', tripRoutes.getAll);
api.get('/trips/:id', tripRoutes.get);
api.post('/trips', tripRoutes.post);
api.put('/trips/:id', tripRoutes.put);
api.delete('/trips/:id', tripRoutes.delete);

// Routes for User and Sessions API that do not require authentication
var userRoutes = require('./routes/users');
var sessionRoutes = require('./routes/sessions')
api.post('/users', admit.create, userRoutes.post);
api.post('/sessions', admit.authenticate, sessionRoutes.post);

// Authenticated Routes
api.use(admit.authorize);
// Logout route (delete the current session)
api.delete('/sessions/current', admit.invalidate, sessionRoutes.delete);

// Prefix all api routes with '/api' path
app.use('/api', api);

// expose app
module.exports = app;

// start server
if (require.main === module) {
  app.listen(config.port, function() {
    return console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}
