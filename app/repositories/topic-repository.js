'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const { tables: T } = tableRepository;

const columnsToReturn = ['guid', 'title', 'summary', 'topicStatus', 'createdAt', 'updatedAt'];

function TopicRepository(mappers, configService) {
  const { topicMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.TOPIC, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return topicMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => topicMapper.dbToDomain(row));
  };

  this.create = async function (domainTopic, transaction) {
    const dbTopic = topicMapper.domainToDb(domainTopic);
    const result = await insertQuery({
      table: T.TOPIC,
      dataToInsert: dbTopic,
      columnsToReturn,
      transaction
    });
    return topicMapper.dbToDomain(first(result));
  };

  this.findByGuid = function (guid, transaction) {
    return find({ whereClause: { guid }, transaction });
  };

  this.findByTopicStatus = async function (
    { topicStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { topicStatus }, limit, page, transaction });
  };

  this.updateByGuid = async function (guid, domainTopic, transaction) {
    const fetchedTopic = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedTopic)) return null;
    const dataToUpdate = topicMapper.updateDomainToDb(domainTopic);
    const result = await updateQuery({
      table: T.TOPIC,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return topicMapper.dbToDomain(first(result));
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };
}

module.exports = TopicRepository;
