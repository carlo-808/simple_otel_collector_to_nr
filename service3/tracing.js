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
const { ConsoleLogger, LogLevel } = require('@opentelemetry/core')

const identifier = process.env.HOSTNAME || os.hostname()
const instanceResource = new Resource({
 [SERVICE_RESOURCE.INSTANCE_ID]: identifier,
 [SERVICE_RESOURCE.NAME]: 'carlotel3'
})

/** Sampler that samples a given fraction of traces based of trace id deterministically. */
class Snampler {
    constructor(_ratio = 0) {
      this._ratio = _ratio
      this._ratio = this._normalize(_ratio)
    }
    shouldSample(context, traceId) {
      const cmp = Math.random()
      return {
        decision: cmp < this._ratio
          ? otelapi.SamplingDecision.RECORD_AND_SAMPLED
          : otelapi.SamplingDecision.NOT_RECORD,
      }
    }
    toString() {
      return `Snampler{${this._ratio}}`
    }
    _normalize(ratio) {
      if (typeof ratio !== 'number' || isNaN(ratio))
        return 0
      return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio
    }
}

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
  sampler: new Snampler(0.2),
  logger: new ConsoleLogger(LogLevel.DEBUG)
})

traceProvider.addSpanProcessor(new BatchSpanProcessor(exporter))

traceProvider.register()
