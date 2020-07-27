'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T } = tableRepository;

const columnsToReturn = [
  'guid',
  'electionGuid',
  'candidateGuid',
  'electionCandidateStatus',
  'createdAt',
  'updatedAt'
];

function ElectionCandidateRepository(mappers, configService) {
  const { electionCandidateMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.ELECTION_CANDIDATE, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return electionCandidateMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => electionCandidateMapper.dbToDomain(row));
  };

  this.create = async function (domainElectionCandidate, transaction) {
    const dbElectionCandidate = electionCandidateMapper.domainToDb(domainElectionCandidate);
    const result = await insertQuery({
      table: T.ELECTION_CANDIDATE,
      dataToInsert: dbElectionCandidate,
      columnsToReturn,
      transaction
    });
    return electionCandidateMapper.dbToDomain(first(result));
  };

  this.findByGuid = function (guid, transaction) {
    return find({ whereClause: { guid }, transaction });
  };

  this.findByElectionGuid = function (
    { electionGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { electionGuid }, limit, page, transaction });
  };

  this.findByCandidateGuid = function (
    { candidateGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { candidateGuid }, limit, page, transaction });
  };

  this.findByElectionCandidateStatus = function (
    { electionCandidateStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { electionCandidateStatus }, limit, page, transaction });
  };

  this.updateByGuid = async function (guid, domainElectionCandidate, transaction) {
    const fetchedElectionCandidate = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedElectionCandidate)) return null;
    const dataToUpdate = electionCandidateMapper.updateDomainToDb(domainElectionCandidate);
    const result = await updateQuery({
      table: T.ELECTION_CANDIDATE,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return electionCandidateMapper.dbToDomain(first(result));
  };

  this.upsert = async function (domainElectionCandidate, transaction) {
    const dbElectionCandidate = electionCandidateMapper.domainToDb(domainElectionCandidate);
    const foundElectionCandidates = await this.findAll(
      {
        whereClause: {
          electionGuid: dbElectionCandidate.electionGuid,
          candidateGuid: dbElectionCandidate.candidateGuid
        },
        limit: 1
      },
      transaction
    );
    if (isEmpty(foundElectionCandidates)) {
      return this.create(domainElectionCandidate, transaction);
    }
    return this.updateByGuid(dbElectionCandidate.guid, domainElectionCandidate, transaction);
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };
}

module.exports = ElectionCandidateRepository;
