const db = require('./db.js');
const log = require('./log.js');
const config = require('./config.js');
const temperatureSensor = require('rasp2c/temperature');
const temperatureDisplay = require('led-backpack/temperature');

// Record the previous reading, to detect wild fluctuations, which are probably errors.
let lastGoodTemperature = temperatureSensor.getLastGoodTemperature();

// Repeatedly call the logging function.
const logTemperature = () => {
  temperatureSensor.readTemperature(config.device1.path)
    .then(celsius => {
      log.debug(`Read temperature of ${celsius}°C from ${config.device1.path}.`);

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
      temperatureDisplay.displayTemperature(celsius);

      db.insertTemperature(celsius, config.device1.location)
        .then(() => {
          log.info(`Recorded ${celsius}°C for ${config.device1.location}.`);
        })
        .catch(err => {
          log.error(`Error inserting record: ${err} ${err.stack}`);
        });
    })
    .catch(err => {
      log.error('Unable to get a good temperature reading.')
      log.error(err.stack);
      return;
    });
};

log.info(`Server is logging to database ${config.database.name} every ${config.logIntervalMilliseconds}ms.`);

temperatureDisplay.init();
logTemperature();
setInterval(logTemperature, config.logIntervalMilliseconds);
