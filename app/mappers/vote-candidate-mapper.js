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

const voteCandidateReportByValidVoteCountCandidateGuidForElectionGuidDbToDomain = {
  electionGuid: 'electionGuid',
  votes: {
    key: 'votes',
    transform: elems =>
      elems.map(el => ({
        candidateGuid: el.candidateGuid,
        candidateHandle: el.candidateHandle,
        voteCount: el.voteCount
      }))
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

  this.reportByValidVoteCountCandidateGuidForElectionGuidDbToDomain = function (
    electionGuid,
    votes,
    electionCandidates
  ) {
    const enrichedVotes = votes.map(vote => {
      const candidate = electionCandidates.find(electionCandidate => {
        return electionCandidate.candidateGuid === vote.candidateGuid;
      });
      const { candidateHandle } = candidate;
      return {
        ...vote,
        candidateHandle
      };
    });
    return objectMapper(
      {
        electionGuid,
        votes: enrichedVotes
      },
      voteCandidateReportByValidVoteCountCandidateGuidForElectionGuidDbToDomain
    );
  };
}

module.exports = VoteCandidateMapper;
