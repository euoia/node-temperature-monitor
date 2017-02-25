const Influx = require('influx');
const log = require('./log.js');
const config = require('./config.js');
const process = require('process');

const influxConfig = {
  host: 'localhost',
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  schema: [
    {
      measurement: 'temperature',
      fields: {
        location: Influx.FieldType.STRING
      },
      tags: []
    }
  ]
};

const influx = new Influx.InfluxDB(influxConfig)

// This does not seem to work when connected to a relay server.
exports.createDatabases = () => {
  return influx.getDatabaseNames()
    .then(names => {
      if (!names.includes(config.database.name)) {
        return influx.createDatabase(config.database.name);
      }
    })
    .catch(err => {
      log.error(`Error creating Influx database!`);
      log.error(err);
      process.exit(1);
    });
};

// Write a single temperature record in JSON format to database table.
exports.insertTemperature = function (celsius, location) {
  const record = {
    measurement: 'temperatures',
    fields: {celsius, location}
  };

  return influx.writePoints([record]);
}
