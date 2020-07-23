'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');

test('Should confirm the existence of required properties', () => {
  const services = new Services();
  expect(keys(services).sort()).toStrictEqual(
    [
      'configService',
      'uuidService',
      'knexService',
      'timeService',
      'logService',
      'base64Service',
      'passwordService',
      'stringifyService'
    ].sort()
  );
});
