import { ILogger } from 'core.logging';

import { ILoggerTransport } from './transports/iLoggerTransport';

const { loggers, format, transports } = require('winston');

export function createWinstonLogger(
  loggerTransport: ILoggerTransport, defaultMeta: object
): ILogger {

  const logTransports = [
    // capture errors in the console
    new transports.Console({ level: 'error' }),

    // send info to the transport
    loggerTransport
  ];

  const logFormat = format.combine(
    format.timestamp({ format: loggerTransport.logging.timestampFormat }),
    format.simple(),
    format.splat(),
    format.printf(loggerFormatter)
  );

  return loggers.add(
    loggerTransport.name,
    {
      format: logFormat,
      defaultMeta,
      transports: logTransports,
    }
  );
}

function loggerFormatter(entry) {
  return `[${entry.timestamp}] [${entry.namespace}] [${entry.level}] ${entry.message}`
}