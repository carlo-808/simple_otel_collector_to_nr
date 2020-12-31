## Simple Express App
### Using Opentelemetry Collector and New Relic Exporter

This project contains three simple express services that call each other and report application telemetry using an OpenTelemetry Collector and New Relic Exporter.

Before running the services, run `npm install` in the `service1`, `service2` and `service3` directories to install all the packages.
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

### Notable Routes for testing various Opentelemetry scenarios
- Service 3 uses a terrible sampler. The Service 2 route `/callServiceThree` can be used to try distributed tracing with a bad sampler in the mix.
- Service 1 has a route `/callServiceTwo` which in turn makes a call back to Service 1. This tests the scenario where a trace contains two requests against the same server.