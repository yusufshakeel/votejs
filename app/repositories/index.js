'use strict';

const CountryRepository = require('./country-repository.js');

function Repositories(mappers) {
  this.countryRepository = new CountryRepository(mappers);
}

module.exports = Repositories;
