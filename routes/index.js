var db = require('../db.js');

var temperature_query = exports.temperature_query = function (req, res) {
	"use strict";

	var num_obs;
	// Test to see if number of observations was specified as url query.
	if (req.query.num_obs) {
		num_obs = parseInt(req.query.num_obs, 2);
	} else {
		// If not specified default to 20. Note use -1 in query string to get all.
		num_obs = -1;
	}

	var start_date;
	if (req.query.start_date) {
		start_date = req.query.start_date;
	} else {
		start_date = '1970-01-01T00:00';
	}

	// Send a message to console log.
	console.log('Database query request from ' + req.connection.remoteAddress +
		' for ' + num_obs + ' records from ' + start_date + '.');

	// Call selectTemp function to get data from database.
	db.selectTemp(num_obs, start_date, function (err, records) {
		if (err) {
			res.writeHead(500, {
				"Content-type": "text/html"
			});

			return res.end(err + "\n");
		}

		res.writeHead(200, {
			"Content-type": "application/json"
		});

		res.end(JSON.stringify(records), "ascii");
	});
	return;
};

var temperature_now = exports.temperature_now = function (temp) {
	"use strict";

	return function (req, res) {
		temp.readTemp(function (error, record) {
			if (error) {
				return res.writeHead(500);
			}

			res.writeHead(200, {
				"Content-type": "application/json"
			});

			return res.end(JSON.stringify({
				unix_time: Date.now(),
				celsius: temp.getLastGoodTemp()
			}), "ascii");
		});
	};
};

var temperature_plot = exports.temperature_plot = function (req, res) {
	"use strict";
	res.render('temperature_plot');
};

var temperature_log = exports.temperature_log = function (req, res) {
	"use strict";
	res.render('temperature_log');
};

var index = exports.index = function (req, res) {
	"use strict";
	res.render('index');
};
