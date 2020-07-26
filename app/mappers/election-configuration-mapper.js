'use strict';

const objectMapper = require('object-mapper');

const electionConfigurationDomainToDb = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  electionConfigurationStatus: 'electionConfigurationStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const electionConfigurationDbToDomain = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  electionConfigurationStatus: 'electionConfigurationStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function ElectionConfigurationMapper(auditMapper) {
  this.domainToDb = function (domainElectionConfiguration) {
    return objectMapper(domainElectionConfiguration, electionConfigurationDomainToDb);
  };

  this.dbToDomain = function (dbElectionConfiguration) {
    return objectMapper(dbElectionConfiguration, electionConfigurationDbToDomain);
  };

  this.updateDomainToDb = function (domainElectionConfiguration) {
    return objectMapper(
      {
        ...domainElectionConfiguration,
        ...auditMapper.updateDomainAudit()
      },
      electionConfigurationDomainToDb
    );
  };
}

module.exports = ElectionConfigurationMapper;
