'use strict';

const { isEmpty, first } = require('lodash');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = ['countryCode', 'countryName', 'code'];

function CountryRepository(mappers) {
  const { countryMapper } = mappers;

  this.create = async function (domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    const result = await transaction(T.COUNTRY).insert(dbCountry).returning(columnsToReturn);
    return countryMapper.dbToDomain(first(result));
  };

  this.findByCountryCode = async function (countryCode, transaction) {
    const result = await transaction(T.COUNTRY).select(columnsToReturn).where({ countryCode });
    if (isEmpty(result)) return null;
    return countryMapper.dbToDomain(first(result));
  };

  this.findByCode = async function (code, transaction) {
    const result = await transaction(T.COUNTRY).select(columnsToReturn).where({ code });
    if (isEmpty(result)) return null;
    return countryMapper.dbToDomain(first(result));
  };

  this.updateByCountryCode = async function (countryCode, domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    const result = await transaction(T.COUNTRY)
      .update(dbCountry)
      .where({ countryCode })
      .returning(columnsToReturn);
    return countryMapper.dbToDomain(first(result));
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
