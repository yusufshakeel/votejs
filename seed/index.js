'use strict';

const Services = require('../app/services');
const Mappers = require('../app/mappers');
const Repositories = require('../app/repositories');
const mappers = new Mappers();
const services = new Services();
const {knexService: knex, logService: {INFO, ERROR, SUCCESS}} = services;
const repositories = new Repositories(mappers);
const {countryRepository} = repositories;

function upsertCountries(countries, txn) {
  return countries.map(country => countryRepository.upsert(country, txn));
}

async function run() {
  try {
    return knex.transaction(async txn => {
      const countries = require('./country.js');
      INFO('Inserting countries...');
      await Promise.all(upsertCountries(countries, txn));
    });
  } catch (err) {
    throw err;
  }
}

run()
  .then(() => {
    INFO('Done!');
  })
  .catch(err => {
    ERROR('An error occurred while setting up the seed data.', err);
  })
  .finally(() => knex.destroy());