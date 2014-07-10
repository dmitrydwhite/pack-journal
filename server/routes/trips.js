'use strict';

var _ = require('lodash');

var Trip = require('../models/trip').Trip;

exports.getAll = function(req, res) {
  Trip.find(function(err, docs) {
    // TODO: Error handling generally
    var mappedDoc = _.map(docs, function(doc) {
      return {
        id  : doc._id,
        name: doc.name,
        features: doc.features
      };
    });
    res.json({ trips: mappedDoc });
  });
};

exports.post = function(req, res) {
  Trip.create(req.body , function(err, doc) {
    // TODO: Handle error
    var mappedDoc = {
      id: doc._id,
      name: doc.name
    };
    res.json({ trip: mappedDoc });
  });
};