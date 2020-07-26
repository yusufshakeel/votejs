'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = [
  'guid',
  'candidateHandle',
  'displayHeader',
  'summary',
  'candidateStatus',
  'createdAt',
  'updatedAt'
];

function CandidateRepository(mappers, configService) {
  const { candidateMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.CANDIDATE, ...params });

  this.create = async function (domainCandidate, transaction) {
    const dbCandidate = candidateMapper.domainToDb(domainCandidate);
    const result = await insertQuery({
      table: T.CANDIDATE,
      dataToInsert: dbCandidate,
      columnsToReturn,
      transaction
    });
    return candidateMapper.dbToDomain(first(result));
  };

  this.findByGuid = async function (guid, transaction) {
    const result = await findBy({
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return candidateMapper.dbToDomain(first(result));
  };

  this.findByCandidateHandle = async function (candidateHandle, transaction) {
    const result = await findBy({
      whereClause: { candidateHandle },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return candidateMapper.dbToDomain(first(result));
  };

  this.findByCandidateStatus = async function (
    { candidateStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause: { candidateStatus },
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => candidateMapper.dbToDomain(row));
  };

  this.updateByGuid = async function (guid, domainCandidate, transaction) {
    const fetchedCandidate = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedCandidate)) return null;
    const dataToUpdate = candidateMapper.updateDomainToDb(domainCandidate);
    const result = await updateQuery({
      table: T.CANDIDATE,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return candidateMapper.dbToDomain(first(result));
  };

  this.findAll = async function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => candidateMapper.dbToDomain(row));
  };
}

module.exports = CandidateRepository;
