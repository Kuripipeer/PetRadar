import * as appInsights from 'applicationinsights';
import * as winston from 'winston';
import { envs } from './envs';

appInsights
  .setup(envs.APPINSIGHTS_CONNECTION_STRING)
  .setAutoCollectConsole(false)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setSendLiveMetrics(true)
  .start();

const aiClient = appInsights.defaultClient;

const appInsightsTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.printf(({ level, message, timestamp }) => {
    aiClient.trackTrace({
      message: `[${level}] ${message}`,
      properties: { timestamp },
    });

    return `${timestamp} [${level}] ${message}`;
  }),
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    appInsightsTransport,
  ],
});