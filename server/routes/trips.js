'use strict';

var Trip = require('../models/trip').Trip;

exports.getAll = function(req, res) {
  Trip.find(function(err, docs) {
    // TODO: Error handling generally
    // TODO: Map the doc to remove unwanted db info
    var tripsRes = { trips: docs };
    res.send(tripsRes);
  });
};

exports.post = function(req, res) {
  Trip.create(req.body , function(err, doc) {
    // TODO: Handle error
    var tripRes = { trip: doc };
    res.send(tripRes);
  });
};