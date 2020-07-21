'use strict';

const CountryRepository = require('./country-repository.js');

module.exports = function Repositories(mappers) {
  this.countryRepository = new CountryRepository(mappers);
};
