'use strict';

const { isEmpty, first } = require('lodash');
const { selectQuery, insertQuery, updateQuery, pagination } = require('../functional/query.js');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = [
  'guid',
  'electionGuid',
  'candidateGuid',
  'electionConfigurationStatus',
  'createdAt',
  'updatedAt'
];

function ElectionConfigurationRepository(mappers, configService) {
  const { electionConfigurationMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = params => selectQuery({ table: T.ELECTION_CONFIGURATION, ...params });

  const find = async function ({ whereClause, transaction }) {
    const result = await findBy({
      ...pagination({ limit: 1, page: 1 }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return electionConfigurationMapper.dbToDomain(first(result));
  };

  const finds = async function ({ whereClause, limit, page, transaction }) {
    const result = await findBy({
      ...pagination({ limit, page }),
      whereClause,
      columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => electionConfigurationMapper.dbToDomain(row));
  };

  this.create = async function (domainElectionConfiguration, transaction) {
    const dbElectionConfiguration = electionConfigurationMapper.domainToDb(
      domainElectionConfiguration
    );
    const result = await insertQuery({
      table: T.ELECTION_CONFIGURATION,
      dataToInsert: dbElectionConfiguration,
      columnsToReturn,
      transaction
    });
    return electionConfigurationMapper.dbToDomain(first(result));
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

  this.findByElectionConfigurationStatus = function (
    { electionConfigurationStatus, limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    return finds({ whereClause: { electionConfigurationStatus }, limit, page, transaction });
  };

  this.updateByGuid = async function (guid, domainElectionConfiguration, transaction) {
    const fetchedElectionConfiguration = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedElectionConfiguration)) return null;
    const dataToUpdate = electionConfigurationMapper.updateDomainToDb(domainElectionConfiguration);
    const result = await updateQuery({
      table: T.ELECTION_CONFIGURATION,
      dataToUpdate,
      whereClause: { guid },
      columnsToReturn,
      transaction
    });
    return electionConfigurationMapper.dbToDomain(first(result));
  };

  this.upsert = async function (domainElectionConfiguration, transaction) {
    const dbElectionConfiguration = electionConfigurationMapper.domainToDb(
      domainElectionConfiguration
    );
    const foundElectionConfiguration = await this.findAll(
      {
        whereClause: {
          electionGuid: dbElectionConfiguration.electionGuid,
          candidateGuid: dbElectionConfiguration.candidateGuid
        },
        limit: 1
      },
      transaction
    );
    if (isEmpty(foundElectionConfiguration)) {
      return this.create(domainElectionConfiguration, transaction);
    }
    return this.updateByGuid(
      dbElectionConfiguration.guid,
      domainElectionConfiguration,
      transaction
    );
  };

  this.findAll = function ({ whereClause, limit = DB_QUERY_LIMIT, page = 1 }, transaction) {
    return finds({ whereClause, limit, page, transaction });
  };
}

module.exports = ElectionConfigurationRepository;
