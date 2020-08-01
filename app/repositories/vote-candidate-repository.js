'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T } = tableRepository;
const {
  VOTE_CANDIDATE_VOTE_STATUS_VALID,
  VOTE_CANDIDATE_VOTE_STATUS_INVALID,
  VOTE_CANDIDATE_VOTE_STATUS_REVERTED,
  VOTE_CANDIDATE_VOTE_STATUS_DELETED
} = require('../constants/vote-candidate-constants.js');

const columnsToReturn = [
  'guid',
  'electionGuid',
  'candidateGuid',
  'voterGuid',
  'voteStatus',
  'createdAt',
  'updatedAt'
];

function VoteCandidateRepository(mappers, configService) {
  const self = this;
  const { voteCandidateMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.VOTE_CANDIDATE, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return voteCandidateMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => voteCandidateMapper.dbToDomain(row));
  };

  const updateByGuid = async function (guid, domainVoteCandidate, transaction) {
    const fetchedVoteCandidate = await self.findByGuid(guid, transaction);
    if (isEmpty(fetchedVoteCandidate)) return null;
    const dataToUpdate = voteCandidateMapper.updateDomainToDb(domainVoteCandidate);
    const result = await updateQuery({
      table: T.VOTE_CANDIDATE,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return voteCandidateMapper.dbToDomain(first(result));
  };

  this.create = async function (domainVoteCandidate, transaction) {
    const dbVoteCandidate = voteCandidateMapper.domainToDb(domainVoteCandidate);
    const result = await insertQuery({
      table: T.VOTE_CANDIDATE,
      dataToInsert: dbVoteCandidate,
      columnsToReturn,
      transaction
    });
    return voteCandidateMapper.dbToDomain(first(result));
  };

  this.findByGuid = function (guid, transaction) {
    return find({ whereClause: { guid }, transaction });
  };

  this.findByVoteStatus = function ({ voteStatus, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause: { voteStatus }, limit, page, transaction });
  };

  this.findByElectionGuid = function (
    { electionGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { electionGuid }, limit, page, transaction });
  };

  this.findByVoterGuid = function ({ voterGuid, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause: { voterGuid }, limit, page, transaction });
  };

  this.findByCandidateGuid = function (
    { candidateGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { candidateGuid }, limit, page, transaction });
  };

  this.invalidVote = function (guid, transaction) {
    const domainVoteCandidate = { voteStatus: VOTE_CANDIDATE_VOTE_STATUS_INVALID };
    return updateByGuid(guid, domainVoteCandidate, transaction);
  };

  this.validVote = function (guid, transaction) {
    const domainVoteCandidate = { voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID };
    return updateByGuid(guid, domainVoteCandidate, transaction);
  };

  this.revertVote = function (guid, transaction) {
    const domainVoteCandidate = { voteStatus: VOTE_CANDIDATE_VOTE_STATUS_REVERTED };
    return updateByGuid(guid, domainVoteCandidate, transaction);
  };

  this.deleteVote = function (guid, transaction) {
    const domainVoteCandidate = { voteStatus: VOTE_CANDIDATE_VOTE_STATUS_DELETED };
    return updateByGuid(guid, domainVoteCandidate, transaction);
  };
}

module.exports = VoteCandidateRepository;
