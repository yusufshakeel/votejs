'use strict';

const CountryMapper = require('./country-mapper.js');

module.exports = function Mappers() {
  this.countryMapper = new CountryMapper();
};
