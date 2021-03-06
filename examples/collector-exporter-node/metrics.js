'use strict';

const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector');
// const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector-grpc');
// const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector-proto');
const { MeterProvider } = require('@opentelemetry/metrics');

// Optional and only needed to see the internal diagnostic logging (during development)
diag.setLogger(new DiagConsoleLogger());
diag.setLogLevel(DiagLogLevel.DEBUG);

const metricExporter = new CollectorMetricExporter({
  serviceName: 'basic-metric-service',
  // url: 'http://localhost:55681/v1/metrics',
});

const meter = new MeterProvider({
  exporter: metricExporter,
  interval: 1000,
}).getMeter('example-exporter-collector');

const requestCounter = meter.createCounter('requests', {
  description: 'Example of a Counter',
});

const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
  description: 'Example of a UpDownCounter',
});

const recorder = meter.createValueRecorder('test_value_recorder', {
  description: 'Example of a ValueRecorder',
});

const labels = { pid: process.pid, environment: 'staging' };

setInterval(() => {
  requestCounter.bind(labels).add(1);
  upDownCounter.bind(labels).add(Math.random() > 0.5 ? 1 : -1);
  recorder.bind(labels).record(Math.random());
}, 1000);
