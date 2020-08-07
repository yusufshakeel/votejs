'use strict';

const pinoLogger = require('pino');

function LogService(configService, pino = pinoLogger) {
  const logger = pino({
    level: configService.logLevel
  });
  return {
    logger,
    INFO: param => logger.info(param),
    SUCCESS: param => logger.success(param),
    ERROR: param => logger.error(param),
    VERBOSE: param => logger.verbose(param)
  };
}

module.exports = LogService;
