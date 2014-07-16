'use strict';

var _ = require('lodash');

var Trip = require('../models/trip').Trip;

exports.getAll = function(req, res) {
  Trip.find({ owner: req.auth.user._id }, function(err, docs) {
    // TODO: Error handling generally
    var mappedDoc = _.map(docs, function(doc) {
      return {
        id  : doc._id,
        name: doc.name,
        owner: doc.owner,
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
        owner: doc.owner,
        features: doc.features
      }
    });
  });
};

exports.post = function(req, res) {
  var tripToCreate = req.body.trip;
  tripToCreate.owner = req.auth.user._id;
  Trip.create(tripToCreate, function(err, doc) {
    var mappedDoc = {
      id: doc._id,
      owner: doc.owner,
      name: doc.name,
      features: doc.features
    };
    res.json({ trip: mappedDoc });
  });
};

exports.put = function(req, res) {
  // TODO: make sure we only update if the requester is the owner
  Trip.findOneAndUpdate({ _id: req.params.id},
    req.body.trip,
    { new: true },
    function(err, doc) {
      var mappedDoc = {
        id: doc._id,
        name: doc.name,
        owner: doc.owner,
        features: doc.features
      };
      res.json({ trip: mappedDoc });
  });
};

exports.delete = function(req, res) {
  // TODO: make sure we only delete if the requester is the owner
  Trip.findByIdAndRemove(req.params.id, {}, function(err, doc) {
    var mappedDoc = {
      id: doc._id,
      name: doc.name,
      owner: doc.owner,
      features: doc.features
    };
    res.json({ trip: mappedDoc });
  });
};
