'use strict';

const { keys } = require('lodash');
const ConfigService = require('../../../../app/services/config-service.js');
const configService = ConfigService();

test('Should confirm the required properties', () => {
  expect(keys(configService).sort()).toStrictEqual(
    [
      'nodeEnvironment',
      'database',
      'dbQueryLimit',
      'connectionPool',
      'logLevel',
      'passwordHashConfig',
      'encryptionAlgorithm',
      'encryptionKey',
      'encryptionIVLength'
    ].sort()
  );
});

test('Should confirm the configService.database properties', () => {
  expect(keys(configService.database)).toStrictEqual(['postgres']);
  expect(keys(configService.database.postgres).sort()).toStrictEqual(
    ['host', 'user', 'password', 'database', 'port'].sort()
  );
});

test('Should confirm the configService.connectionPool properties', () => {
  expect(keys(configService.connectionPool)).toStrictEqual(['knex']);
  expect(keys(configService.connectionPool.knex).sort()).toStrictEqual(
    ['min', 'max', 'acquireConnectionTimeout', 'idleTimeoutMillis'].sort()
  );
});

test('Should confirm the configService.passwordHashConfig properties', () => {
  expect(keys(configService.passwordHashConfig).sort()).toStrictEqual(
    ['algo', 'saltSize', 'iterations', 'keylen', 'digest'].sort()
  );
});
