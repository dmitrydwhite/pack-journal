'use strict';

// production configuration overrides
module.exports = {
  db: {
    connection: process.env.MONGOLAB_URI
  }
};
