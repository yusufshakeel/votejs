'use strict';

const { keys, first } = require('lodash');
const {
  selectQuery,
  insertQuery,
  updateQuery,
  pagination
} = require('../../../../app/functional/query.js');
const Services = require('../../../../app/services');
const Mappers = require('../../../../app/mappers');
const TableRepository = require('../../../../app/repositories/table-repository.js');
const tableRepository = new TableRepository();

const mappers = new Mappers();
const services = new Services();
const T = tableRepository.tables();
const { adminMapper } = mappers;
const { knexService } = services;

const { uuidService, timeService } = services;
const now = timeService.now();

const getFakeDomainAdmin = (guid = uuidService.uuid()) => ({
  guid: guid,
  firstName: 'Jane',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: `${guid}@example.com`,
  userName: `${guid}`,
  password: 'root1234',
  passcode: '123456',
  accountStatus: 'ACTIVE',
  gender: 'FEMALE',
  countryCode: 'IND',
  audit: {
    createdAt: now
  }
});

test('Should be able to find by select query', async () => {
  return knexService.transaction(async txn => {
    const result = await selectQuery({
      table: T.COUNTRY,
      whereClause: { countryCode: 'IND' },
      columnsToReturn: ['countryName'],
      limit: 1,
      offset: 0,
      transaction: txn
    });
    expect(result).toStrictEqual([{ countryName: 'India' }]);
  });
});

test('Should be able to find by select query with lesser arguments', async () => {
  return knexService.transaction(async txn => {
    const result = await selectQuery({
      table: T.COUNTRY,
      whereClause: { countryCode: 'IND' },
      transaction: txn
    });
    expect(keys(first(result))).toStrictEqual(['guid']);
  });
});

test('Should be able to create using insert query', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    const dbAdmin = adminMapper.domainToDb(fakeDomainAdmin);
    const result = await insertQuery({
      table: T.ADMIN,
      dataToInsert: dbAdmin,
      columnsToReturn: ['guid', 'emailId'],
      transaction: txn
    });
    expect(result).toStrictEqual([
      {
        guid: fakeDomainAdmin.guid,
        emailId: fakeDomainAdmin.emailId
      }
    ]);
  });
});

test('Should be able to create using insert query with lesser arguments', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    const dbAdmin = adminMapper.domainToDb(fakeDomainAdmin);
    const result = await insertQuery({
      table: T.ADMIN,
      dataToInsert: dbAdmin,
      transaction: txn
    });
    expect(result).toStrictEqual([
      {
        guid: fakeDomainAdmin.guid
      }
    ]);
  });
});

test('Should be able to update', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    const dbAdmin = adminMapper.domainToDb(fakeDomainAdmin);
    await insertQuery({
      table: T.ADMIN,
      dataToInsert: dbAdmin,
      transaction: txn
    });
    const result = await updateQuery({
      table: T.ADMIN,
      dataToUpdate: { firstName: 'updatedFirstName' },
      whereClause: { guid },
      columnsToReturn: ['guid', 'emailId'],
      transaction: txn
    });
    expect(result).toStrictEqual([
      {
        guid: fakeDomainAdmin.guid,
        emailId: fakeDomainAdmin.emailId
      }
    ]);
  });
});

test('Should be able to update with lesser arguments', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    const dbAdmin = adminMapper.domainToDb(fakeDomainAdmin);
    await insertQuery({
      table: T.ADMIN,
      dataToInsert: dbAdmin,
      transaction: txn
    });
    const result = await updateQuery({
      table: T.ADMIN,
      dataToUpdate: { firstName: 'updatedFirstName' },
      whereClause: { guid },
      transaction: txn
    });
    expect(result).toStrictEqual([
      {
        guid: fakeDomainAdmin.guid
      }
    ]);
  });
});

test('Should be able to generate limit and offset for pagination when non is provided', () => {
  expect(pagination({})).toStrictEqual({ limit: 1, offset: 0 });
});

test('Should be able to generate limit and offset for pagination when limit is provided', () => {
  expect(pagination({ limit: 10 })).toStrictEqual({ limit: 10, offset: 0 });
});

test('Should be able to generate limit and offset for pagination when both are provided', () => {
  expect(pagination({ limit: 10, page: 1 })).toStrictEqual({ limit: 10, offset: 0 });
  expect(pagination({ limit: 10, page: 2 })).toStrictEqual({ limit: 10, offset: 10 });
  expect(pagination({ limit: 10, page: 3 })).toStrictEqual({ limit: 10, offset: 20 });
});

afterAll(() => {
  return knexService.destroy();
});
