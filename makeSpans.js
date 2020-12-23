'use strict'

/*
Code modeled after https://github.com/open-telemetry/opentelemetry-js/tree/master/examples/basic-tracer-node

*/

const opentelemetry = require('@opentelemetry/api')
// const { ConsoleLogger,  LogLevel} = require('@opentelemetry/core')
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector')
// const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc')
// const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-proto')

const exporter = new CollectorTraceExporter({
  serviceName: 'carlotel',
})

const provider = new BasicTracerProvider()
provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register()

const tracer = opentelemetry.trace.getTracer('example-collector-exporter-node')

// TODO: see if we can sample out the parent.

// Create a span. A span must be closed.
const parentSpan = tracer.startSpan('main', {
	kind: opentelemetry.SpanKind.SERVER
})
for (let i = 0; i < 10; i += 1) {
  doWork(parentSpan)
}
// Be sure to end the span.
parentSpan.end()

// give some time before it is closed
setTimeout(() => {
  // flush and close the connection.
  exporter.shutdown()
}, 2000)

function doWork(parent) {
	// TODO: will have to update to the commented code with GA version
  // const ctx = opentelemetry.setSpan(opentelemetry.context.active(), parent)
  const span = tracer.startSpan('childSpan', {
		parent,
		kind: opentelemetry.SpanKind.SERVER
	})

  // simulate some random work.
  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  // Set attributes to the span.
  span.setAttribute('key', 'value')

  // Annotate our span to capture metadata about our operation
  span.addEvent('invoking doWork to create childspan')

  // end span
  span.end()
}