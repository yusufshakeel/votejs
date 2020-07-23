'use strict';

const { keys } = require('lodash');
const ConfigService = require('../../../../app/services/config-service.js');

test('Should confirm the require properties', () => {
  const configService = ConfigService();
  expect(keys(configService).sort()).toStrictEqual(
    ['nodeEnvironment', 'database', 'connectionPool', 'logLevel'].sort()
  );
});
