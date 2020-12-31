'use strict'
const { NodeTracerProvider } = require('@opentelemetry/node')
const { BatchSpanProcessor } = require('@opentelemetry/tracing')
const otelapi = require("@opentelemetry/api")
// const { ConsoleLogger,  LogLevel} = require('@opentelemetry/core')
// const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing')
// const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin')
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector')
const { Resource, SERVICE_RESOURCE } = require('@opentelemetry/resources')
const os = require('os')
const { Console } = require('console')
const { ConsoleLogger, LogLevel, TraceIdRatioBasedSampler } = require('@opentelemetry/core')

class AlwaysSample {
  shouldSample(context, traceId) {
    const cmp = Math.random()
    return {
      decision: otelapi.SamplingDecision.RECORD_AND_SAMPLED
    }
  }
}

const identifier = process.env.HOSTNAME || os.hostname()
const instanceResource = new Resource({
 [SERVICE_RESOURCE.INSTANCE_ID]: identifier,
 [SERVICE_RESOURCE.NAME]: 'carlotel2'
})

const mergedResource = Resource.createTelemetrySDKResource().merge(instanceResource)

const exporter = new CollectorTraceExporter({
  url: 'http://collector:55681/v1/trace'
  // logger: new ConsoleLogger(LogLevel.DEBUG)
})

const traceProvider = new NodeTracerProvider({
  resource: mergedResource,
  plugins: {
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      ignoreOutgoingUrls: [
        /\/v1\/metrics/
      ]
    }
  },
  sampler: new AlwaysSample(),
  logger: new ConsoleLogger(LogLevel.DEBUG)
})

traceProvider.addSpanProcessor(new BatchSpanProcessor(exporter))

traceProvider.register()
