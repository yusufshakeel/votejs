'use strict';

const { isEmpty, first, pickBy } = require('lodash');
const { selectQuery, insertQuery, updateQuery } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();
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

function VoterRepository(mappers, configService) {
  const { voterMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.VOTER, ...params });

  this.create = async function (domainVoter, transaction) {
    const dbVoter = voterMapper.domainToDb(domainVoter);
    const result = await insertQuery({
      table: T.VOTER,
      dataToInsert: dbVoter,
      columnsToReturn,
      transaction
    });
    return voterMapper.dbToDomain(first(result));
  };

  this.findByGuid = async function (guid, transaction) {
    const result = await findBy({
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return voterMapper.dbToDomain(first(result));
  };

  this.findByEmailId = async function (emailId, transaction) {
    const result = await findBy({
      whereClause: { emailId },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return voterMapper.dbToDomain(first(result));
  };

  this.findByUserName = async function (userName, transaction) {
    const result = await findBy({
      whereClause: { userName },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return voterMapper.dbToDomain(first(result));
  };

  this.findByAccountStatus = async function (
    accountStatus,
    { limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    const result = await findBy({
      whereClause: { accountStatus },
      columnsToReturn,
      limit,
      offset: (page - 1) * limit,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => voterMapper.dbToDomain(row));
  };

  this.updateByGuid = async function (guid, domainVoter, transaction) {
    const fetchedVoter = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedVoter)) return null;
    const dataToUpdate = voterMapper.updateDomainToDb(domainVoter);
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
      password,
      passcode,
      accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE
    });
    const result = await findBy({
      whereClause: pickBy(whereClause),
      columnsToReturn,
      limit: 1,
      transaction
    });
    if (isEmpty(result)) return null;
    return voterMapper.dbToDomain(first(result));
  };
}

module.exports = VoterRepository;
