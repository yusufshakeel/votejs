'use strict';

const objectMapper = require('object-mapper');

const voteCandidateDomainToDb = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  voterGuid: 'voterGuid',
  voteStatus: 'voteStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const voteCandidateDbToDomain = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  candidateGuid: 'candidateGuid',
  voterGuid: 'voterGuid',
  voteStatus: 'voteStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function VoteCandidateMapper(auditMapper) {
  this.domainToDb = function (domainVoteCandidate) {
    return objectMapper(domainVoteCandidate, voteCandidateDomainToDb);
  };

  this.dbToDomain = function (dbVoteCandidate) {
    return objectMapper(dbVoteCandidate, voteCandidateDbToDomain);
  };

  this.updateDomainToDb = function (domainVoteCandidate) {
    return objectMapper(
      {
        ...domainVoteCandidate,
        ...auditMapper.updateDomainAudit()
      },
      voteCandidateDomainToDb
    );
  };
}

module.exports = VoteCandidateMapper;
