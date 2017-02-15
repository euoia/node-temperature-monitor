let influx = require('influx'),
  log = require('./log.js');

// Write a single temperature record in JSON format to database table.
exports.insertTemp = function (tempRecord, callback) {
	log.info("Inserting temperature " + tempRecord.celsius + " at " + tempRecord.unix_time);

	// data is a javascript object.
	var statement = influx.prepare("INSERT INTO temperature_records VALUES (?, ?)");

	// Insert values into prepared statement.
	statement.run(tempRecord.unix_time, tempRecord.celsius);

	// Execute the statement.
	statement.finalize(callback);
}
