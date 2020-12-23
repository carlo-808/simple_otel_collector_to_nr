'use strict'
const { NodeTracerProvider } = require('@opentelemetry/node')
const { BatchSpanProcessor } = require('@opentelemetry/tracing')
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
 [SERVICE_RESOURCE.NAME]: 'carlotel'
})

const mergedResource = Resource.createTelemetrySDKResource().merge(instanceResource)

const exporter = new CollectorTraceExporter({
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
  logger: new ConsoleLogger(LogLevel.DEBUG)
})

traceProvider.addSpanProcessor(new BatchSpanProcessor(exporter))

traceProvider.register()
