'use strict';

const Services = require('../../../../app/services');

test('Should confirm the existence of required properties', () => {
  const services = new Services();
  expect(services).toHaveProperty('configService');
  expect(services).toHaveProperty('uuidService');
  expect(services).toHaveProperty('knexService');
});
