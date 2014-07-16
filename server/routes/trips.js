'use strict';

var _ = require('lodash');
var Trip = require('../models/trip').Trip;

module.exports = {
  getAll: function(req, res) {
    Trip.findAsync({ owner: req.auth.user._id })
    .then(function(docs) {
      var mappedDoc = _.map(docs, function(doc) {
        return {
          id  : doc._id,
          name: doc.name,
          owner: doc.owner,
          features: doc.features
        };
      });
      res.json({ trips: mappedDoc });
    })
    .catch(function(e) {
      console.log('Can not get trips:', e);
    });
  },

  get: function(req, res) {
    Trip.findByIdAsync(req.params.id)
    .then(function(doc) {
      res.json({
        trip: {
          id: doc._id,
          name: doc.name,
          owner: doc.owner,
          features: doc.features
        }
      });
    })
    .catch(function(e) {
      console.log('Can not get trip:', e);
    });
  },

  post: function(req, res) {
    var tripToCreate = req.body.trip;
    tripToCreate.owner = req.auth.user._id;
    Trip.createAsync(tripToCreate)
    .then(function(doc) {
      var mappedDoc = {
        id: doc._id,
        owner: doc.owner,
        name: doc.name,
        features: doc.features
      };
      res.json({ trip: mappedDoc });
    })
    .catch(function(e) {
      console.log('Can not post trip: ', e);
    });
  },

  put: function(req, res) {
    // TODO: make sure we only update if the requester is the owner
    Trip.findOneAndUpdateAsync({ _id: req.params.id}, req.body.trip, { new: true })
    .then(function(doc) {
      var mappedDoc = {
        id: doc._id,
        name: doc.name,
        owner: doc.owner,
        features: doc.features
      };
      res.json({ trip: mappedDoc });
    })
    .catch(function(e) {
      console.log('Can not update trip: ', e);
    });
  },

  delete: function(req, res) {
    // TODO: make sure we only delete if the requester is the owner
    Trip.findByIdAndRemoveAsync(req.params.id, {})
    .then(function(doc) {
      var mappedDoc = {
        id: doc._id,
        name: doc.name,
        owner: doc.owner,
        features: doc.features
      };
      res.json({ trip: mappedDoc });
    })
    .catch(function(e) {
      console.log('Can not delete trip: ', e);
    });
  }
};
