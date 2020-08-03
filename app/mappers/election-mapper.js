'use strict';

const objectMapper = require('object-mapper');

const electionApiToDomain = {
  title: 'title',
  summary: 'summary',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  voteOn: 'voteOn',
  electionStatus: 'electionStatus',
  electionSettings: 'electionSettings'
};

const electionDomainToApi = {
  guid: 'guid',
  title: 'title',
  summary: 'summary',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  voteOn: 'voteOn',
  electionStatus: 'electionStatus',
  electionSettings: 'electionSettings',
  audit: 'audit'
};

const electionDomainToDb = {
  guid: 'guid',
  title: 'title',
  summary: 'summary',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  voteOn: 'voteOn',
  electionStatus: 'electionStatus',
  electionSettings: 'electionSettings',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const electionDbToDomain = {
  guid: 'guid',
  title: 'title',
  summary: 'summary',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  voteOn: 'voteOn',
  electionStatus: 'electionStatus',
  electionSettings: 'electionSettings',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function ElectionMapper(auditMapper) {
  this.apiToDomain = function (apiElection) {
    return objectMapper(apiElection, electionApiToDomain);
  };

  this.domainToApi = function (domainElection) {
    return objectMapper(domainElection, electionDomainToApi);
  };

  this.domainToDb = function (domainElection) {
    return objectMapper(domainElection, electionDomainToDb);
  };

  this.dbToDomain = function (dbElection) {
    return objectMapper(dbElection, electionDbToDomain);
  };

  this.updateDomainToDb = function (domainElection) {
    return objectMapper(
      {
        ...domainElection,
        ...auditMapper.updateDomainAudit()
      },
      electionDomainToDb
    );
  };
}

module.exports = ElectionMapper;
