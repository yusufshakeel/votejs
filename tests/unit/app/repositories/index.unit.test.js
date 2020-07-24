'use strict';

const { keys } = require('lodash');
const Repositories = require('../../../../app/repositories');
const Mappers = require('../../../../app/mappers');
const ConfigService = require('../../../../app/services/config-service.js');

test('Should confirm the existence of required properties', () => {
  const mappers = new Mappers();
  const configService = ConfigService();
  const repositories = new Repositories(mappers, configService);
  expect(keys(repositories).sort()).toStrictEqual(['countryRepository', 'adminRepository'].sort());
});
