'use strict';

const objectMapper = require('object-mapper');

const electionCandidateApiToDomain = {
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  electionCandidateStatus: 'electionCandidateStatus',
  candidateDisplayHeader: 'candidateDisplayHeader',
  candidateHandle: 'candidateHandle',
  candidateSummary: 'candidateSummary',
  candidateStatus: 'candidateStatus'
};

const electionCandidateDomainToApi = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  electionCandidateStatus: 'electionCandidateStatus',
  candidateDisplayHeader: 'candidateDisplayHeader',
  candidateHandle: 'candidateHandle',
  candidateSummary: 'candidateSummary',
  candidateStatus: 'candidateStatus',
  audit: 'audit'
};

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
  this.apiToDomain = function (apiElectionCandidate) {
    return objectMapper(apiElectionCandidate, electionCandidateApiToDomain);
  };

  this.domainToApi = function (domainElectionCandidate) {
    return objectMapper(domainElectionCandidate, electionCandidateDomainToApi);
  };

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
