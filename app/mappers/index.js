'use strict';

const CountryMapper = require('./country-mapper.js');

function Mappers() {
  this.countryMapper = new CountryMapper();
}

module.exports = Mappers;

