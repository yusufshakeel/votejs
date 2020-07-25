'use strict';

const query = require('../../../../app/functional/query.js');
const Services = require('../../../../app/services');
const TableRepository = require('../../../../app/repositories/table-repository.js');
const tableRepository = new TableRepository();

const services = new Services();
const T = tableRepository.tables();
const { knexService } = services;

test('Should be able to search using findBy', async () => {
  const { findBy } = query;
  return knexService.transaction(async txn => {
    const result = await findBy({
      table: T.COUNTRY,
      whereClause: { countryCode: 'IND' },
      columns: ['countryName'],
      limit: 1,
      offset: 0,
      transaction: txn
    });
    expect(result).toStrictEqual([{ countryName: 'India' }]);
  });
});

test('Should be able to search using findBy with lesser arguments', async () => {
  const { findBy } = query;
  return knexService.transaction(async txn => {
    const result = await findBy({
      table: T.COUNTRY,
      whereClause: { countryCode: 'IND' },
      columns: ['countryName'],
      transaction: txn
    });
    expect(result).toStrictEqual([{ countryName: 'India' }]);
  });
});

afterAll(() => {
  return knexService.destroy();
});
