/* exported User */

'use strict';

var User = require('../models/user').User;

exports.post = function(req, res) {
  res.json({
    user: {
      id: req.auth.user._id,
      username: req.auth.user.username
    }
  });
};