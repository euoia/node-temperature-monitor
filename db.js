var express = require('express'),
	sqlite3 = require('sqlite3');

// Setup database connection for logging.
var db = new sqlite3.Database('./piTemps.db');

var selectTemp = exports.selectTemp = function (num_records, start_date, callback) {
	"use strict";

	// - Num records is an SQL filter from latest record back trough time series,
	// - start_date is the first date in the time-series required,
	// - callback is the output function
	var current_temp = db.all(
		"SELECT * FROM (SELECT * FROM temperature_records WHERE unix_time > (strftime('%s',?)*1000) ORDER BY unix_time DESC LIMIT ?) ORDER BY unix_time;",
		start_date,
		num_records,
		function (err, rows) {
			if (err) {
				console.log('Error serving querying database. ' + err);
				return callback(err);
			}

			var records = {
				temperature_records: [rows]
			};

			callback(null, records);
		}
	);
};

// Write a single temperature record in JSON format to database table.
var insertTemp = exports.insertTemp = function (tempRecord, callback) {
	"use strict";

	console.log("Inserting temperature " + tempRecord.celsius + " at " + tempRecord.unix_time);

	// data is a javascript object.
	var statement = db.prepare("INSERT INTO temperature_records VALUES (?, ?)");

	// Insert values into prepared statement.
	statement.run(tempRecord.unix_time, tempRecord.celsius);

	// Execute the statement.
	statement.finalize(callback);
}
