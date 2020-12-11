## Simple Express App
### Using Open Telemetry Collector and New Relic Exporter


### Collector
You will need a `.env` file at the root of the project folder with the following environment variables:
* NEW_RELIC_API_KEY
* NEW_RELIC_TRACE_URL
* NEW_RELIC_METRIC_URL

Start the collector with this command:

`npm run docker:start`

**Note**

This example overrides the New Relic exporter trace and metric URLs. Typically you will not need those set and the New Relic exporter config in `collector.yaml` should look like this:
```
exporters:
  newrelic:
    apikey: ${NEW_RELIC_API_KEY}
```

### Express Application
Set the `SERVICE_RESOURCE.NAME` in the `tracing.js` file.

Start the app with this command:
`npm run start`
