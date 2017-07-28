const config = {};
config.jwtSecret = require('crypto')
  .randomBytes(32)
  .toString('hex');

module.exports = config;
