'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T, column: tableColumn } = tableRepository;

const {
  VOTE_TOPIC_VOTE_STATUS_VALID,
  VOTE_TOPIC_VOTE_STATUS_INVALID,
  VOTE_TOPIC_VOTE_STATUS_REVERTED,
  VOTE_TOPIC_VOTE_STATUS_DELETED
} = require('../constants/vote-topic-constants.js');

const columnsToReturn = [
  'guid',
  'electionGuid',
  'topicGuid',
  'voterGuid',
  'voteStatus',
  'createdAt',
  'updatedAt'
];

function VoteTopicRepository(mappers, configService, repositories) {
  const self = this;
  const { voteTopicMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;
  const { electionTopicRepository } = repositories;

  const findBy = params => selectQuery({ table: T.VOTE_TOPIC, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return voteTopicMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => voteTopicMapper.dbToDomain(row));
  };

  const updateByGuid = async function (guid, domainVoteTopic, transaction) {
    const fetchedVoteTopic = await self.findByGuid(guid, transaction);
    if (isEmpty(fetchedVoteTopic)) return null;
    const dataToUpdate = voteTopicMapper.updateDomainToDb(domainVoteTopic);
    const result = await updateQuery({
      table: T.VOTE_TOPIC,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return voteTopicMapper.dbToDomain(first(result));
  };

  this.create = async function (domainVoteTopic, transaction) {
    const dbVoteTopic = voteTopicMapper.domainToDb(domainVoteTopic);
    const result = await insertQuery({
      table: T.VOTE_TOPIC,
      dataToInsert: dbVoteTopic,
      columnsToReturn,
      transaction
    });
    return voteTopicMapper.dbToDomain(first(result));
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

  this.findByTopicGuid = function ({ topicGuid, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause: { topicGuid }, limit, page, transaction });
  };

  this.invalidVote = function (guid, transaction) {
    const domainVoteTopic = { voteStatus: VOTE_TOPIC_VOTE_STATUS_INVALID };
    return updateByGuid(guid, domainVoteTopic, transaction);
  };

  this.validVote = function (guid, transaction) {
    const domainVoteTopic = { voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID };
    return updateByGuid(guid, domainVoteTopic, transaction);
  };

  this.revertVote = function (guid, transaction) {
    const domainVoteTopic = { voteStatus: VOTE_TOPIC_VOTE_STATUS_REVERTED };
    return updateByGuid(guid, domainVoteTopic, transaction);
  };

  this.deleteVote = function (guid, transaction) {
    const domainVoteTopic = { voteStatus: VOTE_TOPIC_VOTE_STATUS_DELETED };
    return updateByGuid(guid, domainVoteTopic, transaction);
  };

  this.reportByVoteStatusAndElectionGuid = async function (electionGuid, transaction) {
    const result = await transaction
      .select(tableColumn(T.VOTE_TOPIC)('voteStatus'))
      .count('topicGuid', { as: 'voteCount' })
      .from(T.VOTE_TOPIC)
      .where({ electionGuid })
      .groupBy(tableColumn(T.VOTE_TOPIC)('voteStatus'))
      .orderBy(tableColumn(T.VOTE_TOPIC)('voteStatus'));
    if (isEmpty(result)) return null;
    return voteTopicMapper.reportByVoteStatusAndElectionGuidDbToDomain(electionGuid, result);
  };

  this.reportByValidVoteCountTopicGuidForElectionGuid = async function (electionGuid, transaction) {
    const votes = await transaction
      .select(tableColumn(T.VOTE_TOPIC)('topicGuid'))
      .count('topicGuid', { as: 'voteCount' })
      .from(T.VOTE_TOPIC)
      .where({ electionGuid, voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID })
      .groupBy(tableColumn(T.VOTE_TOPIC)('topicGuid'))
      .orderBy('voteCount', 'desc');

    if (isEmpty(votes)) return null;

    const electionTopicCount = await electionTopicRepository.countByElectionGuid(
      electionGuid,
      transaction
    );
    const electionTopics = await electionTopicRepository.findByElectionGuid(
      {
        electionGuid,
        limit: electionTopicCount.topicCount
      },
      transaction
    );

    return voteTopicMapper.reportByValidVoteCountTopicGuidForElectionGuidDbToDomain(
      electionGuid,
      votes,
      electionTopics
    );
  };
}

module.exports = VoteTopicRepository;
