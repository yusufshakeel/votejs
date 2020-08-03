'use strict';

const objectMapper = require('object-mapper');

const countryApiToDomain = {
  countryCode: 'countryCode',
  countryName: 'countryName',
  code: 'code'
};

const countryDomainToApi = {
  guid: 'guid',
  countryCode: 'countryCode',
  countryName: 'countryName',
  code: 'code',
  audit: 'audit'
};

const countryDomainToDb = {
  guid: 'guid',
  countryCode: 'countryCode',
  countryName: 'countryName',
  code: 'code',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const countryDbToDomain = {
  guid: 'guid',
  countryCode: 'countryCode',
  countryName: 'countryName',
  code: 'code',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function CountryMapper(auditMapper) {
  this.apiToDomain = function (apiCountry) {
    return objectMapper(apiCountry, countryApiToDomain);
  };

  this.domainToApi = function (domainCountry) {
    return objectMapper(domainCountry, countryDomainToApi);
  };

  this.domainToDb = function (domainCountry) {
    return objectMapper(domainCountry, countryDomainToDb);
  };

  this.dbToDomain = function (dbCountry) {
    return objectMapper(dbCountry, countryDbToDomain);
  };

  this.updateDomainToDb = function (domainCountry) {
    return objectMapper(
      {
        ...domainCountry,
        ...auditMapper.updateDomainAudit()
      },
      countryDomainToDb
    );
  };
}

module.exports = CountryMapper;
