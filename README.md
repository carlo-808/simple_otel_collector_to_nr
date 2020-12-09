## Simple Express App
### Using Open Telemetry Collector and New Relic Exporter


### Collector
You will need a `.env` file at the root of the project folder with the following environment variables:
* NEW_RELIC_API_KEY
* NEW_RELIC_TRACE_URL
* NEW_RELIC_METRIC_URL

Start the collector with this command:

`npm run docker:start`


### Express Application
Set the `SERVICE_RESOURCE.NAME` in the `tracing.js` file.

Start the app with this command:
`npm run start`
