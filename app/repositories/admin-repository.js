'use strict';

const { isEmpty, first, pickBy } = require('lodash');
const { findBy } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();
const { ADMIN_ACCOUNT_STATUS_ACTIVE } = require('../constants/admin-constants.js');

const columnsToReturn = [
  'guid',
  'firstName',
  'middleName',
  'lastName',
  'emailId',
  'userName',
  'accountStatus',
  'gender',
  'countryCode',
  'createdAt',
  'updatedAt'
];

function AdminRepository(mappers, configService) {
  const { adminMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  this.create = async function (domainAdmin, transaction) {
    const dbAdmin = adminMapper.domainToDb(domainAdmin);
    const result = await transaction(T.ADMIN).insert(dbAdmin).returning(columnsToReturn);
    return adminMapper.dbToDomain(first(result));
  };

  this.findByGuid = async function (guid, transaction) {
    const result = await findBy({
      table: T.ADMIN,
      whereClause: { guid },
      columns: columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  this.findByEmailId = async function (emailId, transaction) {
    const result = await findBy({
      table: T.ADMIN,
      whereClause: { emailId },
      columns: columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  this.findByUserName = async function (userName, transaction) {
    const result = await findBy({
      table: T.ADMIN,
      whereClause: { userName },
      columns: columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  this.findByAccountStatus = async function (
    accountStatus,
    { limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    const result = await findBy({
      table: T.ADMIN,
      whereClause: { accountStatus },
      columns: columnsToReturn,
      limit,
      offset: (page - 1) * limit,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => adminMapper.dbToDomain(row));
  };

  this.updateByGuid = async function (guid, domainAdmin, transaction) {
    const fetchedAdmin = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedAdmin)) return null;
    const dataToUpdate = adminMapper.updateDomainToDb(domainAdmin);
    const result = await transaction(T.ADMIN)
      .update(dataToUpdate)
      .where({ guid })
      .returning(columnsToReturn);
    return adminMapper.dbToDomain(first(result));
  };

  this.validateForLogin = async function ({ userName, emailId, password, passcode }, transaction) {
    const whereClause = adminMapper.domainToDb({
      userName,
      emailId,
      password,
      passcode,
      accountStatus: ADMIN_ACCOUNT_STATUS_ACTIVE
    });
    const result = await findBy({
      table: T.ADMIN,
      whereClause: pickBy(whereClause),
      columns: columnsToReturn,
      limit: 1,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };
}

module.exports = AdminRepository;
