'use strict';

const { keys } = require('lodash');
const ConfigService = require('../../../../app/services/config-service.js');
const LogService = require('../../../../app/services/log-service.js');

const fakePinoLogger = () => ({
  info: v => v,
  success: v => v,
  error: v => v,
  verbose: v => v
});
const configService = ConfigService();
const logService = LogService(configService, fakePinoLogger);
const {
  logger,
  INFO,
  SUCCESS,
  ERROR,
  VERBOSE,
  logINFO,
  logSUCCESS,
  logERROR,
  logVERBOSE
} = logService;

test('Should confirm the properties of logger', () => {
  expect(keys(logger).sort()).toStrictEqual(['error', 'info', 'success', 'verbose'].sort());
});

test('Should be able to call INFO', () => {
  expect(INFO('a')).toStrictEqual('a');
});

test('Should be able to call SUCCESS', () => {
  expect(SUCCESS('a')).toStrictEqual('a');
});

test('Should be able to call ERROR', () => {
  expect(ERROR('a')).toStrictEqual('a');
});

test('Should be able to call VERBOSE', () => {
  expect(VERBOSE('a')).toStrictEqual('a');
});

test('Should be able to call logINFO', () => {
  expect(logINFO('mod', 'fnName', 'msg')).toStrictEqual({
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
  expect(logINFO('mod', 'fnName', 'msg', { foo: 'bar' })).toStrictEqual({
    details: {
      foo: 'bar'
    },
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
});

test('Should be able to call logSUCCESS', () => {
  expect(logSUCCESS('mod', 'fnName', 'msg')).toStrictEqual({
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
  expect(logSUCCESS('mod', 'fnName', 'msg', { foo: 'bar' })).toStrictEqual({
    details: {
      foo: 'bar'
    },
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
});

test('Should be able to call logERROR', () => {
  expect(logERROR('mod', 'fnName', 'msg')).toStrictEqual({
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
  expect(logERROR('mod', 'fnName', 'msg', { foo: 'bar' })).toStrictEqual({
    details: {
      foo: 'bar'
    },
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
});

test('Should be able to call logVERBOSE', () => {
  expect(logVERBOSE('mod', 'fnName', 'msg')).toStrictEqual({
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
  expect(logVERBOSE('mod', 'fnName', 'msg', { foo: 'bar' })).toStrictEqual({
    details: {
      foo: 'bar'
    },
    functionName: 'fnName',
    message: 'msg',
    module: 'mod'
  });
});
