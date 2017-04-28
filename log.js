/* Application logging. */
const config = require('./config.js');
const winston = require('winston');

require('winston-loggly-bulk');

function zeroPad(num, len) {
  return ('0'.repeat(len) + num.toString()).slice(0 - len);
}

const logger = new (winston.Logger)({
  level: config.log.level,
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        const d = new Date();
        const year = d.getUTCFullYear();
        const month = zeroPad(d.getUTCMonth(), 2);
        const day = zeroPad(d.getUTCDay(), 2);
        const hours = zeroPad(d.getUTCHours(), 2);
        const minutes = zeroPad(d.getUTCMinutes(), 2);
        const seconds = zeroPad(d.getUTCSeconds(), 2);
        const milliseconds = zeroPad(d.getUTCMilliseconds(), 3);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
      },
      formatter: function(options) {
        // Log metadata as stringified objects.
        const extra = Object.keys(options.meta).length > 0 ?
          ` ${JSON.stringify(options.meta)}` : ``;

        return `${options.timestamp()} - ${options.level.toUpperCase()}: ${options.message}${extra}`;
      }
    })
  ]
});

const logglyConfig = {
    inputToken: config.log.loggly_token,
    subdomain: config.log.loggly_subdomain,
    tags: ["Winston-NodeJS"],
    json:true
};

logger.add(winston.transports.Loggly, logglyConfig);
logger.add(winston.transports.File, {filename: config.log.dir + `/temperature-display.log`});

module.exports = logger;
