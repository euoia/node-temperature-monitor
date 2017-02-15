const temp = require('node-rasp2c-temp/temp');
const db = require('./db.js');
const log = require('./log.js');

// Log interval in milliseconds.
const logIntervalMilliseconds = 30 * 1000;

// Record the previous reading, to detect wild fluctuations, which are probably errors.
let lastGoodTemp = null;

// Repeatedly call the logging function.
setInterval(function logTemperature() {
  log.info('Inserting last good temperature reading into database.');

  const celsius = temp.getLastGoodTemp();
  if (celsius === null) {
    log.error('Even the last good temp was bad! Not inserting anything.');
    return;
  }

  // If reading is very different from the last "good" temperature from the sensor, then ignore it.
  // TODO: Implement this properly:
  //  * A very different reading from the last one should be ignored.
  //  * Make the range configurable.
  //  * If the temperature ever jumps by more than +10 or -10 in one reading,
  //    this version will break because all subsequent readings will be
  //    discarded.
  if (lastGoodTemp !== null && (celsius > lastGoodTemp + 15 || celsius < lastGoodTemp - 15)) {
    log.error('Probably a weird reading (' + celsius + 'C) - very different from the last good one (' + lastGoodTemp + 'C), ignoring.');
    return;
  }

  lastGoodTemp = celsius;

  const record = {
    unix_time: Date.now(),
    celsius: celsius
  };

  db.insertTemp(record, function (error) {
    if (error) {
      log.error('Error inserting into database.');
      log.error(error);
    }
  });

}, logIntervalMilliseconds);

log.info('Server is logging to database at ' + logIntervalMilliseconds + 'ms intervals');
