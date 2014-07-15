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

exports.delete = function(req, res) {
  if (req.auth.user) { throw new Error('Session not invalidated.'); }
  res.json({ status: 'ok' });
};
