'use strict';

const { isEmpty, first } = require('lodash');
const { insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T, column: tableColumn } = tableRepository;

const columnsToReturn = [
  'guid',
  'electionGuid',
  'candidateGuid',
  'electionCandidateStatus',
  'createdAt',
  'updatedAt'
];

const columnsToSelect = {
  guid: tableColumn(T.ELECTION_CANDIDATE)('guid'),
  electionGuid: tableColumn(T.ELECTION_CANDIDATE)('electionGuid'),
  candidateGuid: tableColumn(T.ELECTION_CANDIDATE)('candidateGuid'),
  electionCandidateStatus: tableColumn(T.ELECTION_CANDIDATE)('electionCandidateStatus'),
  createdAt: tableColumn(T.ELECTION_CANDIDATE)('createdAt'),
  updatedAt: tableColumn(T.ELECTION_CANDIDATE)('updatedAt'),
  candidateDisplayHeader: tableColumn(T.CANDIDATE)('displayHeader'),
  candidateHandle: tableColumn(T.CANDIDATE)('candidateHandle'),
  candidateSummary: tableColumn(T.CANDIDATE)('summary'),
  candidateStatus: tableColumn(T.CANDIDATE)('candidateStatus')
};

function ElectionCandidateRepository(mappers, configService) {
  const { electionCandidateMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = ({
    whereClause,
    columnsToSelect,
    orderBy = [{ column: `${tableColumn(T.ELECTION_CANDIDATE)('createdAt')}`, order: 'desc' }],
    limit = 1,
    offset = 0,
    transaction
  }) => {
    if (isEmpty(whereClause)) {
      return transaction
        .select(columnsToSelect)
        .from(`${T.ELECTION_CANDIDATE} AS ${T.ELECTION_CANDIDATE}`)
        .innerJoin(
          T.CANDIDATE,
          tableColumn(T.ELECTION_CANDIDATE)('candidateGuid'),
          tableColumn(T.CANDIDATE)('guid')
        )
        .limit(limit)
        .offset(offset)
        .orderBy(orderBy);
    }
    return transaction
      .select(columnsToSelect)
      .from(`${T.ELECTION_CANDIDATE} AS ${T.ELECTION_CANDIDATE}`)
      .innerJoin(
        T.CANDIDATE,
        tableColumn(T.ELECTION_CANDIDATE)('candidateGuid'),
        tableColumn(T.CANDIDATE)('guid')
      )
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);
  };

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      whereClause,
      columnsToSelect,
      transaction
    });
    if (isEmpty(result)) return null;
    return electionCandidateMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToSelect,
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
    return find({
      whereClause: { [tableColumn(T.ELECTION_CANDIDATE)('guid')]: guid },
      transaction
    });
  };

  this.findByElectionGuid = function (
    { electionGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({
      whereClause: { [tableColumn(T.ELECTION_CANDIDATE)('electionGuid')]: electionGuid },
      limit,
      page,
      transaction
    });
  };

  this.findByCandidateGuid = function (
    { candidateGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({
      whereClause: { [tableColumn(T.ELECTION_CANDIDATE)('candidateGuid')]: candidateGuid },
      limit,
      page,
      transaction
    });
  };

  this.findByElectionCandidateStatus = function (
    { electionCandidateStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({
      whereClause: {
        [tableColumn(T.ELECTION_CANDIDATE)('electionCandidateStatus')]: electionCandidateStatus
      },
      limit,
      page,
      transaction
    });
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
