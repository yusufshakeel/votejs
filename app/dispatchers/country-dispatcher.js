'use strict';

function CountryDispatcher({ mappers, services, repositories }) {
  const { countryMapper } = mappers;
  const { countryRepository } = repositories;
  const { knexService } = services;

  this.createCountry = function (apiCountry) {
    return knexService.transaction(async txn => {
      const domainCountry = countryMapper.apiToDomain(apiCountry);
      const createdCountry = await countryRepository.create(domainCountry, txn);
      return countryMapper.domainToApi(createdCountry);
    });
  };

  this.findCountryByCountryCode = function (countryCode) {
    return knexService.transaction(async txn => {
      const fetchedCountry = await countryRepository.findByCountryCode(countryCode, txn);
      return countryMapper.domainToApi(fetchedCountry);
    });
  };

  this.findCountryByCode = function (code) {
    return knexService.transaction(async txn => {
      const fetchedCountry = await countryRepository.findByCode(code, txn);
      return countryMapper.domainToApi(fetchedCountry);
    });
  };

  this.updateCountryByCountryCode = function (countryCode, apiCountry) {
    return knexService.transaction(async txn => {
      const domainCountry = countryMapper.apiToDomain(apiCountry);
      const updatedCountry = await countryRepository.updateByCountryCode(
        countryCode,
        domainCountry,
        txn
      );
      return countryMapper.domainToApi(updatedCountry);
    });
  };
}

module.exports = CountryDispatcher;
