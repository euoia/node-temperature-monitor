'use strict';
const fs = require('fs-sync');

if (fs.exists('.env') === false) {
  /* eslint no-console: 0 */
  console.log('> cp .env.example .env');
  fs.copy('.env.example', '.env');
}

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  app: {
    port: process.env.APP_PORT
  },
  log: {
    level: process.env.LOG_LEVEL
  }
}
