'use strict';

const CountryMapper = require('./country-mapper.js');
const AdminMapper = require('./admin-mapper.js');

function Mappers() {
  this.countryMapper = new CountryMapper();
  this.adminMapper = new AdminMapper();
}

module.exports = Mappers;

