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

const voteCandidateReportByVoteStatusAndElectionGuidDbToDomain = {
  electionGuid: 'electionGuid',
  votes: {
    key: 'votes',
    transform: elems => elems.map(el => ({ voteStatus: el.voteStatus, voteCount: el.voteCount }))
  }
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

  this.reportByVoteStatusAndElectionGuidDbToDomain = function (electionGuid, votes) {
    return objectMapper(
      {
        electionGuid,
        votes
      },
      voteCandidateReportByVoteStatusAndElectionGuidDbToDomain
    );
  };
}

module.exports = VoteCandidateMapper;
