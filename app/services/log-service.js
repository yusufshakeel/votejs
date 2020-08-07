'use strict';

const { pickBy } = require('lodash');
const pinoLogger = require('pino');

function LogService(configService, pino = pinoLogger) {
  const logger = pino({
    level: configService.logLevel
  });
  const logFn = fn => (module, functionName, message, details) =>
    fn(pickBy({ module, functionName, message, details }));
  return {
    logger,
    logINFO: logFn(logger.info),
    logSUCCESS: logFn(logger.success),
    logERROR: logFn(logger.error),
    logVERBOSE: logFn(logger.verbose),
    INFO: param => logger.info(param),
    SUCCESS: param => logger.success(param),
    ERROR: param => logger.error(param),
    VERBOSE: param => logger.verbose(param)
  };
}

module.exports = LogService;
