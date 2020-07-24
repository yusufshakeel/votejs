'use strict';

const Services = require('../app/services');
const Mappers = require('../app/mappers');
const Repositories = require('../app/repositories');
const mappers = new Mappers();
const services = new Services();
const {
  knexService: knex,
  logService: { INFO, ERROR },
  configService
} = services;
const repositories = new Repositories(mappers, configService);
const { countryRepository, adminRepository } = repositories;

function createDevDemoAdmins(admins, txn) {
  INFO('Creating admin for demo...');
  return admins.map(admin => {
    const domainAdmin = {
      ...admin,
      password: services.passwordService.hashPassword('root1234')
    };
    return adminRepository.create(domainAdmin, txn);
  });
}

function upsertCountries(countries, txn) {
  INFO('Creating countries...');
  return countries.map(country => countryRepository.upsert(country, txn));
}

async function run() {
  return knex.transaction(async txn => {
    const countries = require('./country.js');
    const admins = require('./admin.js');
    await Promise.all(upsertCountries(countries, txn));
    if (configService.nodeEnvironment === 'dev') {
      await Promise.all(createDevDemoAdmins(admins.dev, txn));
    }
  });
}

run()
  .then(() => {
    INFO('Done!');
  })
  .catch(err => {
    ERROR('An error occurred while setting up the seed data.', err);
  })
  .finally(() => knex.destroy());
