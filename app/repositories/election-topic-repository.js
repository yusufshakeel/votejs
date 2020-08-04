'use strict';

const { isEmpty, first } = require('lodash');
const { insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T, column: tableColumn } = tableRepository;

const columnsToReturn = [
  'guid',
  'electionGuid',
  'topicGuid',
  'electionTopicStatus',
  'createdAt',
  'updatedAt'
];

const columnsToSelect = {
  guid: tableColumn(T.ELECTION_TOPIC)('guid'),
  electionGuid: tableColumn(T.ELECTION_TOPIC)('electionGuid'),
  topicGuid: tableColumn(T.ELECTION_TOPIC)('topicGuid'),
  electionTopicStatus: tableColumn(T.ELECTION_TOPIC)('electionTopicStatus'),
  createdAt: tableColumn(T.ELECTION_TOPIC)('createdAt'),
  updatedAt: tableColumn(T.ELECTION_TOPIC)('updatedAt'),
  topicTitle: tableColumn(T.TOPIC)('title'),
  topicSummary: tableColumn(T.TOPIC)('summary'),
  topicStatus: tableColumn(T.TOPIC)('topicStatus')
};

function ElectionTopicRepository(mappers, configService) {
  const { electionTopicMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = ({
    whereClause,
    columnsToSelect,
    orderBy = [{ column: `${tableColumn(T.ELECTION_TOPIC)('createdAt')}`, order: 'desc' }],
    limit = 1,
    offset = 0,
    transaction
  }) => {
    if (isEmpty(whereClause)) {
      return transaction
        .select(columnsToSelect)
        .from(`${T.ELECTION_TOPIC} AS ${T.ELECTION_TOPIC}`)
        .innerJoin(
          T.TOPIC,
          tableColumn(T.ELECTION_TOPIC)('topicGuid'),
          tableColumn(T.TOPIC)('guid')
        )
        .limit(limit)
        .offset(offset)
        .orderBy(orderBy);
    }
    return transaction
      .select(columnsToSelect)
      .from(`${T.ELECTION_TOPIC} AS ${T.ELECTION_TOPIC}`)
      .innerJoin(T.TOPIC, tableColumn(T.ELECTION_TOPIC)('topicGuid'), tableColumn(T.TOPIC)('guid'))
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
    return electionTopicMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToSelect,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => electionTopicMapper.dbToDomain(row));
  };

  this.create = async function (domainElectionTopic, transaction) {
    const dbElectionTopic = electionTopicMapper.domainToDb(domainElectionTopic);
    const result = await insertQuery({
      table: T.ELECTION_TOPIC,
      dataToInsert: dbElectionTopic,
      columnsToReturn,
      transaction
    });
    return electionTopicMapper.dbToDomain(first(result));
  };

  this.findByGuid = function (guid, transaction) {
    return find({
      whereClause: { [tableColumn(T.ELECTION_TOPIC)('guid')]: guid },
      transaction
    });
  };

  this.findByElectionGuid = function (
    { electionGuid, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({
      whereClause: { [tableColumn(T.ELECTION_TOPIC)('electionGuid')]: electionGuid },
      limit,
      page,
      transaction
    });
  };

  this.findByTopicGuid = function ({ topicGuid, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({
      whereClause: { [tableColumn(T.ELECTION_TOPIC)('topicGuid')]: topicGuid },
      limit,
      page,
      transaction
    });
  };

  this.findByElectionTopicStatus = function (
    { electionTopicStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({
      whereClause: {
        [tableColumn(T.ELECTION_TOPIC)('electionTopicStatus')]: electionTopicStatus
      },
      limit,
      page,
      transaction
    });
  };

  this.updateByGuid = async function (guid, domainElectionTopic, transaction) {
    const fetchedElectionTopic = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedElectionTopic)) return null;
    const dataToUpdate = electionTopicMapper.updateDomainToDb(domainElectionTopic);
    const result = await updateQuery({
      table: T.ELECTION_TOPIC,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return electionTopicMapper.dbToDomain(first(result));
  };

  this.upsert = async function (domainElectionTopic, transaction) {
    const dbElectionTopic = electionTopicMapper.domainToDb(domainElectionTopic);
    const foundElectionTopics = await this.findAll(
      {
        whereClause: {
          electionGuid: dbElectionTopic.electionGuid,
          topicGuid: dbElectionTopic.topicGuid
        },
        limit: 1
      },
      transaction
    );
    if (isEmpty(foundElectionTopics)) {
      return this.create(domainElectionTopic, transaction);
    }
    return this.updateByGuid(dbElectionTopic.guid, domainElectionTopic, transaction);
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };

  this.countByElectionGuid = async function (electionGuid, transaction) {
    const result = await transaction
      .count(tableColumn(T.ELECTION_TOPIC)('guid'), { as: 'topicCount' })
      .from(T.ELECTION_TOPIC)
      .where({ electionGuid });
    return electionTopicMapper.countByElectionGuidDbToDomain(
      electionGuid,
      first(result).topicCount
    );
  };
}

module.exports = ElectionTopicRepository;
