'use strict';

const { isEmpty, first, pickBy } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T } = tableRepository;
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

function AdminRepository(mappers, configService, passwordService) {
  const { adminMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;
  const { hashPassword, isValidPasswordHash } = passwordService;

  const findBy = params => selectQuery({ table: T.ADMIN, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => adminMapper.dbToDomain(row));
  };

  this.create = async function (domainAdmin, transaction) {
    const hashedPassword = await hashPassword(domainAdmin.password);
    const dbAdmin = adminMapper.domainToDb({ ...domainAdmin, password: hashedPassword });
    const result = await insertQuery({
      table: T.ADMIN,
      dataToInsert: dbAdmin,
      columnsToReturn,
      transaction
    });
    return adminMapper.dbToDomain(first(result));
  };

  this.findByGuid = function (guid, transaction) {
    return find({ whereClause: { guid }, transaction });
  };

  this.findByEmailId = function (emailId, transaction) {
    return find({ whereClause: { emailId }, transaction });
  };

  this.findByUserName = function (userName, transaction) {
    return find({ whereClause: { userName }, transaction });
  };

  this.findByAccountStatus = function (
    { accountStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { accountStatus }, limit, page, transaction });
  };

  this.updateByGuid = async function (guid, domainAdmin, transaction) {
    const fetchedAdmin = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedAdmin)) return null;
    const enrichedDomainAdmin = domainAdmin.password
      ? { ...domainAdmin, password: await hashPassword(domainAdmin.password) }
      : domainAdmin;
    const dataToUpdate = adminMapper.updateDomainToDb(enrichedDomainAdmin);
    const result = await updateQuery({
      table: T.ADMIN,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return adminMapper.dbToDomain(first(result));
  };

  this.validateForLogin = async function ({ userName, emailId, password, passcode }, transaction) {
    const whereClause = adminMapper.domainToDb({
      userName,
      emailId,
      passcode,
      accountStatus: ADMIN_ACCOUNT_STATUS_ACTIVE
    });
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause: pickBy(whereClause),
      columnsToReturn: [...columnsToReturn, 'password'],
      transaction
    });
    if (isEmpty(result)) return null;
    const fetchedAdmin = first(result);
    const isValidPassword = await isValidPasswordHash(fetchedAdmin.password, password);
    if (!isValidPassword) return null;
    return adminMapper.dbToDomain(fetchedAdmin);
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };
}

module.exports = AdminRepository;
