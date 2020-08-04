'use strict';

const pinoLogger = require('pino');

function LogService(configService, pino = pinoLogger) {
  const logger = pino({
    level: configService.logLevel
  });
  return {
    logger,
    INFO: (...params) => logger.info(...params),
    SUCCESS: (...params) => logger.success(...params),
    ERROR: (...params) => logger.error(...params),
    VERBOSE: (...params) => logger.verbose(...params)
  };
}

module.exports = LogService;
