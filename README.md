## Simple Express App
### Using Open Telemetry Collector and New Relic Exporter

Before running the services, run `npm install` in the `service1` and `service1` directories to install all the packages.
I'll fix this up later :)

### Collector
You will need a `.env` file at the root of the project folder with the following environment variables:
* NEW_RELIC_API_KEY
* NEW_RELIC_TRACE_URL
* NEW_RELIC_METRIC_URL

**Note**

This example overrides the New Relic exporter trace and metric URLs. Typically you will not need those set and the New Relic exporter config in `collector.yaml` should look like this:
```
exporters:
  newrelic:
    apikey: ${NEW_RELIC_API_KEY}
```

### Start it up
run `docker-compose up` at the root of the project.
