'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T } = tableRepository;

const columnsToReturn = [
  'guid',
  'title',
  'summary',
  'startsAt',
  'endsAt',
  'voteOn',
  'electionStatus',
  'electionSettings',
  'createdAt',
  'updatedAt'
];

function ElectionRepository(mappers, configService) {
  const { electionMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.ELECTION, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return electionMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => electionMapper.dbToDomain(row));
  };

  this.create = async function (domainElection, transaction) {
    const dbElection = electionMapper.domainToDb(domainElection);
    const result = await insertQuery({
      table: T.ELECTION,
      dataToInsert: dbElection,
      columnsToReturn,
      transaction
    });
    return electionMapper.dbToDomain(first(result));
  };

  this.findByGuid = function (guid, transaction) {
    return find({ whereClause: { guid }, transaction });
  };

  this.findByElectionStatus = function (
    { electionStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { electionStatus }, limit, page, transaction });
  };

  this.updateByGuid = async function (guid, domainElection, transaction) {
    const fetchedElection = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedElection)) return null;
    const dataToUpdate = electionMapper.updateDomainToDb(domainElection);
    const result = await updateQuery({
      table: T.ELECTION,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return electionMapper.dbToDomain(first(result));
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };
}

module.exports = ElectionRepository;
