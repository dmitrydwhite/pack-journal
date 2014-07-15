'use strict';

exports.post = function(req, res) {
  res.json({
    session: {
      id: req.auth.user._id,
      username: req.auth.user.username,
      sessionDigests: req.auth.user.sessionDigests
    }
  });
};