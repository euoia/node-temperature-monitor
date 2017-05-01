# Temperature Logger

Reads temperatures from one or more DS18B20 temperature sensors and logs to
influxDB.

## Requirements

This JavaScript application runs with Node.js version 6.5.0 or higher. It
requires an InfluxDB to write to.

To configure the application copy `.env.example` to `.env` and run with `npm
start`.

In order to run, the application must have read access to the DS18B20 probes
configured as `DEVICES`.

This program is intended to run on a Raspberry Pi, but may work in other
environments.

## Start on boot (systemd)

`
sudo cp scripts/temperature-logger.service /lib/systemd/system
sudo systemctl enable temperature-logger.service
sudo systemctl start temperature-logger.service
`
