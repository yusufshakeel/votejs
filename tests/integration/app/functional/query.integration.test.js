'use strict';

const { keys, first } = require('lodash');
const query = require('../../../../app/functional/query.js');
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
  const { select: selectQuery } = query;
  return knexService.transaction(async txn => {
    const result = await selectQuery({
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

test('Should be able to find by select query with lesser arguments', async () => {
  const { select: selectQuery } = query;
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
  const { insert: insertQuery } = query;
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
  const { insert: insertQuery } = query;
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
  const { insert: insertQuery, update: updateQuery } = query;
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
  const { insert: insertQuery, update: updateQuery } = query;
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

afterAll(() => {
  return knexService.destroy();
});
