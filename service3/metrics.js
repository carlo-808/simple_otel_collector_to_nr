'use strict'

const { MeterProvider } = require('@opentelemetry/metrics')
const { ConsoleLogger, LogLevel } = require('@opentelemetry/core')
const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector')

const metricExporter = new CollectorMetricExporter({
  serviceName: 'carlotel3',
  url: 'http://collector:55681/v1/metrics'
})

const meter = new MeterProvider({
  exporter: metricExporter,
  interval: 60000
}).getMeter('example-meter')

const requestCounter = meter.createCounter('ponyRequest', {
  description: 'request counter example'
})

const paths = new Map()

function metricsMiddleware(options = {}) {
  return (req, res, next) => {
    if (!paths.has(req.path)) {
      const labels = { route: req.path }
      const boundCounter = requestCounter.bind(labels)
      paths.set(req.path, boundCounter)
    }

    paths.get(req.path).add(1)

    return next()
  }
}

module.exports = metricsMiddleware

