'use strict';

const { isEmpty, first, pickBy } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T } = tableRepository;
const { VOTER_ACCOUNT_STATUS_ACTIVE } = require('../constants/voter-constants.js');

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

function VoterRepository(mappers, configService, passwordService) {
  const { voterMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;
  const { hashPassword, isValidPasswordHash } = passwordService;

  const findBy = params => selectQuery({ table: T.VOTER, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return voterMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => voterMapper.dbToDomain(row));
  };

  this.create = async function (domainVoter, transaction) {
    const hashedPassword = await hashPassword(domainVoter.password);
    const dbVoter = voterMapper.domainToDb({ ...domainVoter, password: hashedPassword });
    const result = await insertQuery({
      table: T.VOTER,
      dataToInsert: dbVoter,
      columnsToReturn,
      transaction
    });
    return voterMapper.dbToDomain(first(result));
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

  this.updateByGuid = async function (guid, domainVoter, transaction) {
    const fetchedVoter = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedVoter)) return null;
    const enrichedDomainVoter = domainVoter.password
      ? { ...domainVoter, password: await hashPassword(domainVoter.password) }
      : domainVoter;
    const dataToUpdate = voterMapper.updateDomainToDb(enrichedDomainVoter);
    const result = await updateQuery({
      table: T.VOTER,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return voterMapper.dbToDomain(first(result));
  };

  this.validateForLogin = async function ({ userName, emailId, password, passcode }, transaction) {
    const whereClause = voterMapper.domainToDb({
      userName,
      emailId,
      passcode,
      accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE
    });
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause: pickBy(whereClause),
      columnsToReturn: [...columnsToReturn, 'password'],
      transaction
    });
    if (isEmpty(result)) return null;
    const fetchedVoter = first(result);
    const isValidPassword = await isValidPasswordHash(fetchedVoter.password, password);
    if (!isValidPassword) return null;
    return voterMapper.dbToDomain(fetchedVoter);
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };
}

module.exports = VoterRepository;
