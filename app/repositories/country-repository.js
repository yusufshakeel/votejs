'use strict';

const { isEmpty, first } = require('lodash');
const {
  select: selectQuery,
  insert: insertQuery,
  update: updateQuery
} = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = ['countryCode', 'countryName', 'code'];

function CountryRepository(mappers) {
  const { countryMapper } = mappers;

  const findBy = params => selectQuery({ table: T.COUNTRY, ...params });

  this.create = async function (domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    const result = await insertQuery({
      table: T.COUNTRY,
      dataToInsert: dbCountry,
      columnsToReturn,
      transaction
    });
    return countryMapper.dbToDomain(first(result));
  };

  this.findByCountryCode = async function (countryCode, transaction) {
    const result = await findBy({
      whereClause: { countryCode },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return countryMapper.dbToDomain(first(result));
  };

  this.findByCode = async function (code, transaction) {
    const result = await findBy({
      whereClause: { code },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return countryMapper.dbToDomain(first(result));
  };

  this.updateByCountryCode = async function (countryCode, domainCountry, transaction) {
    const dbCountry = countryMapper.domainToDb(domainCountry);
    const result = await updateQuery({
      table: T.COUNTRY,
      dataToUpdate: dbCountry,
      whereClause: { countryCode },
      columnsToReturn,
      transaction
    });
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
