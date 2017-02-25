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
  logIntervalMilliseconds: process.env.LOG_INTERVAL_MS,
  database: {
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  },
  log: {
    level: process.env.LOG_LEVEL,
    loggly_token: process.env.LOG_LOGGLY_TOKEN,
    loggly_subdomain: process.env.LOG_LOGGLY_SUBDOMAIN
  }
}
