'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = [
  'guid',
  'title',
  'summary',
  'startsAt',
  'endsAt',
  'electionStatus',
  'electionSettings',
  'createdAt',
  'updatedAt'
];

function ElectionRepository(mappers, configService) {
  const { electionMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.ELECTION, ...params });

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

  this.findByGuid = async function (guid, transaction) {
    const result = await findBy({
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return electionMapper.dbToDomain(first(result));
  };

  this.findByElectionStatus = async function (
    { electionStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause: { electionStatus },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => electionMapper.dbToDomain(row));
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
}

module.exports = ElectionRepository;
