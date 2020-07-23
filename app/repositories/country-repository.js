'use strict';

const { isEmpty } = require('lodash');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = ['countryCode', 'countryName', 'code'];

function CountryRepository(mappers) {
  const { countryMapper } = mappers;

  this.create = async function (domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    return transaction(T.COUNTRY).insert(dbCountry).returning(columnsToReturn);
  };

  this.findByCountryCode = async function (countryCode, transaction) {
    return transaction(T.COUNTRY).select(columnsToReturn).where({ countryCode });
  };

  this.findByCode = async function (code, transaction) {
    return transaction(T.COUNTRY).select(columnsToReturn).where({ code });
  };

  this.updateByCountryCode = async function (countryCode, domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    return transaction(T.COUNTRY)
      .update(dbCountry)
      .where({ countryCode })
      .returning(columnsToReturn);
  };

  this.upsert = async function (domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    const foundCountry = await this.findByCountryCode(dbCountry.countryCode, transaction);
    if (isEmpty(foundCountry)) {
      return this.create(domainCountry, transaction);
    }
    return this.updateByCountryCode(dbCountry.countryCode, domainCountry, transaction);
  };
}

module.exports = CountryRepository;
