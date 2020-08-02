'use strict';

const objectMapper = require('object-mapper');

const electionCandidateDomainToDb = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  electionCandidateStatus: 'electionCandidateStatus',
  candidateDisplayHeader: 'candidateDisplayHeader',
  candidateHandle: 'candidateHandle',
  candidateSummary: 'candidateSummary',
  candidateStatus: 'candidateStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const electionCandidateDbToDomain = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  electionCandidateStatus: 'electionCandidateStatus',
  candidateDisplayHeader: 'candidateDisplayHeader',
  candidateHandle: 'candidateHandle',
  candidateSummary: 'candidateSummary',
  candidateStatus: 'candidateStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

const electionCandidateCountByElectionGuidDbToDomain = {
  electionGuid: 'electionGuid',
  candidateCount: 'candidateCount'
};

function ElectionCandidateMapper(auditMapper) {
  this.domainToDb = function (domainElectionCandidate) {
    return objectMapper(domainElectionCandidate, electionCandidateDomainToDb);
  };

  this.dbToDomain = function (dbElectionCandidate) {
    return objectMapper(dbElectionCandidate, electionCandidateDbToDomain);
  };

  this.updateDomainToDb = function (domainElectionCandidate) {
    return objectMapper(
      {
        ...domainElectionCandidate,
        ...auditMapper.updateDomainAudit()
      },
      electionCandidateDomainToDb
    );
  };

  this.countByElectionGuidDbToDomain = function (electionGuid, candidateCount) {
    return objectMapper(
      {
        electionGuid,
        candidateCount
      },
      electionCandidateCountByElectionGuidDbToDomain
    );
  };
}

module.exports = ElectionCandidateMapper;
