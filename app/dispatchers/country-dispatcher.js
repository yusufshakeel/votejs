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

  this.findAllCountries = function () {
    return knexService.transaction(async txn => {
      const fetchedCountries = await countryRepository.findAllCountries(txn);
      return fetchedCountries.map(country => countryMapper.domainToApi(country));
    });
  };
}

module.exports = CountryDispatcher;
