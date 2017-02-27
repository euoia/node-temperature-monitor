'use strict';
const _ = require('lodash');

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
  },
  // devices are listed as path, value pairs. We convert to an array of objects.
  devices: _.chunk(process.env.DEVICES.split(' '), 2)
    .map(values => {return {path: values[0], location: values[1]}})
}
