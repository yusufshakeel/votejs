'use strict';

const Services = require('../app/services');
const Mappers = require('../app/mappers');
const Repositories = require('../app/repositories');
const mappers = new Mappers();
const services = new Services();
const {
  knexService: knex,
  logService: { INFO, logERROR },
  configService,
  passwordService,
  stringifyService: { stringify }
} = services;
const repositories = new Repositories({ mappers, configService, passwordService });
const { countryRepository, adminRepository, voterRepository } = repositories;

function createDevDemoVoters(voters, txn) {
  INFO('Creating dev demo voters...');
  return voters.map(voter => voterRepository.create(voter, txn));
}

function createDevDemoAdmins(admins, txn) {
  INFO('Creating dev demo admins...');
  return admins.map(admin => adminRepository.create(admin, txn));
}

function upsertCountries(countries, txn) {
  INFO('Creating countries...');
  return countries.map(country => countryRepository.upsert(country, txn));
}

async function run() {
  return knex.transaction(async txn => {
    const countries = require('./country.js');
    const admins = require('./admin.js');
    const voters = require('./voter.js');
    await Promise.all(upsertCountries(countries, txn));
    if (configService.nodeEnvironment === 'dev') {
      await Promise.all(createDevDemoAdmins(admins.dev, txn));
      await Promise.all(createDevDemoVoters(voters.dev, txn));
    }
  });
}

run()
  .then(() => {
    INFO('Done!');
  })
  .catch(err => {
    logERROR('SEED', 'run', 'An error occurred while setting up the seed data.', stringify(err));
  })
  .finally(() => knex.destroy());
