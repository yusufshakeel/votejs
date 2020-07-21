'use strict';

const ConfigService = require('../../../../app/services/config-service.js');

test('Should confirm the require properties', () => {
  const configService = ConfigService();
  expect(configService).toHaveProperty('nodeEnvironment');
  expect(configService).toHaveProperty('database');
  expect(configService).toHaveProperty('connectionPool');
});