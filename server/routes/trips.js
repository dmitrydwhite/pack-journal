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

exports.get = function(req, res) {
  Trip.findById(req.params.id, function(err, doc) {
    res.json({
      trip: {
        id: doc._id,
        name: doc.name,
        features: doc.features
      }
    });
  });
};

exports.post = function(req, res) {
  Trip.create(req.body.trip , function(err, doc) {
    var mappedDoc = {
      id: doc._id,
      name: doc.name,
      features: doc.features
    };
    res.json({ trip: mappedDoc });
  });
};