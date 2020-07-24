'use strict';

const CountryRepository = require('./country-repository.js');
const AdminRepository = require('./admin-repository.js');

function Repositories(mappers, configService) {
  this.countryRepository = new CountryRepository(mappers);
  this.adminRepository = new AdminRepository(mappers, configService);
}

module.exports = Repositories;
