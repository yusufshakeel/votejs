'use strict';

const objectMapper = require('object-mapper');

const countryDomainToDb = {
  countryCode: 'countryCode',
  countryName: 'countryName',
  code: 'code'
};

const countryDbToDomain = {
  countryCode: 'countryCode',
  countryName: 'countryName',
  code: 'code'
};

function CountryMapper() {
  this.domainToDb = function (domainCountry) {
    return objectMapper(domainCountry, countryDomainToDb);
  };

  this.dbToDomain = function (dbCountry) {
    return objectMapper(dbCountry, countryDbToDomain);
  };
}

module.exports = CountryMapper;
