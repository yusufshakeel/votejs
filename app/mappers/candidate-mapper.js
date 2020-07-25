'use strict';

const objectMapper = require('object-mapper');

const candidateDomainToDb = {
  guid: 'guid',
  candidateHandle: 'candidateHandle',
  displayHeader: 'displayHeader',
  summary: 'summary',
  candidateStatus: 'candidateStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const candidateDbToDomain = {
  guid: 'guid',
  candidateHandle: 'candidateHandle',
  displayHeader: 'displayHeader',
  summary: 'summary',
  candidateStatus: 'candidateStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function CandidateMapper(auditMapper) {
  this.domainToDb = function (domainCandidate) {
    return objectMapper(domainCandidate, candidateDomainToDb);
  };

  this.dbToDomain = function (dbCandidate) {
    return objectMapper(dbCandidate, candidateDbToDomain);
  };

  this.updateDomainToDb = function (domainCandidate) {
    return objectMapper(
      {
        ...domainCandidate,
        ...auditMapper.updateDomainAudit()
      },
      candidateDomainToDb
    );
  };
}

module.exports = CandidateMapper;
