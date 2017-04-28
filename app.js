/* Application */
const db = require('./db.js');
const log = require('./log.js');
const config = require('./config.js');
const temperatureSensor = require('rasp2c/temperature');
const _ = require('lodash');

// Record the previous reading, to detect wild fluctuations, which are probably errors.
let lastGoodTemperature = temperatureSensor.getLastGoodTemperature();

// Log a temperature result.
const logTemperature = (celsius, location) => {
  // If reading is very different from the last "good" temperature from the
  // sensor, then ignore it.
  if (lastGoodTemperature !== null && Math.abs(celsius - lastGoodTemperature) > 15) {
    log.error(
      `Got a weird reading (${celsius}°C is very different from the ` +
      `last good reading ${lastGoodTemperature}°C) - ignoring.`
    );
    return;
  }

  lastGoodTemperature = celsius;

  db.insertTemperature(celsius, location)
    .then(() => {
      log.info(`Recorded ${celsius}°C for ${location}.`);
    })
    .catch(err => {
      log.error(`Error inserting record: ${err} ${err.stack}`);
    });
}

// Read from all temperature sensors and log the results.
const logTemperatures = () => {
  config.devices.forEach((device) => {
    temperatureSensor.readTemperature(device.path)
      .then(celsius => {
        log.debug(`Read temperature of ${celsius}°C for ${device.location}.`);
        logTemperature(celsius, device.location)
      })
      .catch(err => {
        log.error('Unable to get a good temperature reading.')
        log.error(err.stack);
        return;
      });
  });
}

log.info(`Server is logging to database ${config.database.name} every ${config.logIntervalMilliseconds}ms.`);
log.info(`Logging temperatures in: ${_.map(config.devices, 'location').join(', ')}.`);

logTemperatures();
setInterval(logTemperatures, config.logIntervalMilliseconds);
