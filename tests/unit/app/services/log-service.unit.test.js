'use strict';

const {keys} = require('lodash');
const ConfigService = require('../../../../app/services/config-service.js');
const LogService = require('../../../../app/services/log-service.js');

const fakePinoLogger = () => ({
  info: (...v) => v,
  success: (...v) => v,
  error: (...v) => v,
  verbose: (...v) => v,
});
const configService = ConfigService();
const logService = LogService(configService, fakePinoLogger);
const {logger, INFO, SUCCESS, ERROR, VERBOSE} = logService;

test('Should confirm the properties of logger', () => {
  expect(keys(logger).sort()).toStrictEqual(['error', 'info', 'success', 'verbose'].sort());
});

test('Should be able to call INFO', () => {
  expect(INFO('a', 'b', 'c')).toStrictEqual(['a', 'b', 'c']);
});

test('Should be able to call SUCCESS', () => {
  expect(SUCCESS('a', 'b', 'c')).toStrictEqual(['a', 'b', 'c']);
});

test('Should be able to call ERROR', () => {
  expect(ERROR('a', 'b', 'c')).toStrictEqual(['a', 'b', 'c']);
});

test('Should be able to call VERBOSE', () => {
  expect(VERBOSE('a', 'b', 'c')).toStrictEqual(['a', 'b', 'c']);
});
