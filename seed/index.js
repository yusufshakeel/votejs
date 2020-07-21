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
  return knex.transaction(async txn => {
    const countries = require('./country.js');

    INFO('Inserting countries...');
    await Promise.all(upsertCountries(countries, txn));
  });
}

run()
  .then(() => {
    INFO('Done!');
  })
  .finally(() => knex.destroy());