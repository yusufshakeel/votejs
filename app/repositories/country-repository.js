'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = ['countryCode', 'countryName', 'code'];

function CountryRepository(mappers) {
  const { countryMapper } = mappers;

  const findBy = params => selectQuery({ table: T.COUNTRY, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return countryMapper.dbToDomain(first(result));
  };

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

  this.findByCountryCode = function (countryCode, transaction) {
    return find({ whereClause: { countryCode }, transaction });
  };

  this.findByCode = function (code, transaction) {
    return find({ whereClause: { code }, transaction });
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
