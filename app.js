const temperature = require('led-backpack/temperature');
const db = require('./db.js');
const log = require('./log.js');
const config = require('./config.js');

// TODO: Turn this into a configurable map between the sensor ID and the
// location string.
const location = 'office';

// Record the previous reading, to detect wild fluctuations, which are probably errors.
let lastGoodTemperature = temperature.getLastGoodTemperature();

// Repeatedly call the logging function.
const logTemperature = () => {
  const celsius = temperature.getLastGoodTemperature();
  if (celsius === null) {
    log.error('Unable to get a good temperature reading.');
    return;
  }

  // If reading is very different from the last "good" temperature from the sensor, then ignore it.
  // TODO: Implement this properly:
  //  * A very different reading from the last one should be ignored.
  //  * Make the range configurable.
  //  * If the temperature ever jumps by more than +10 or -10 in one reading,
  //    this version will break because all subsequent readings will be
  //    discarded.
  if (lastGoodTemperature !== null && (celsius > lastGoodTemperature + 15 || celsius < lastGoodTemperature - 15)) {
    log.error('Probably a weird reading (' + celsius + 'C) - very different from the last good one (' + lastGoodTemperature + 'C), ignoring.');
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
};

log.info(`Server is logging to database ${config.database.name} every ${config.logIntervalMilliseconds}ms.`);

temperature.init();
logTemperature();
setInterval(logTemperature, config.logIntervalMilliseconds);
