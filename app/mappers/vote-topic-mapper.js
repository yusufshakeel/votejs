'use strict';

const objectMapper = require('object-mapper');

const voteTopicApiToDomain = {
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  voterGuid: 'voterGuid',
  voteStatus: 'voteStatus'
};

const voteTopicDomainToApi = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  voterGuid: 'voterGuid',
  voteStatus: 'voteStatus',
  audit: 'audit'
};

const voteTopicDomainToDb = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  voterGuid: 'voterGuid',
  voteStatus: 'voteStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const voteTopicDbToDomain = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  voterGuid: 'voterGuid',
  voteStatus: 'voteStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

const voteTopicReportByVoteStatusAndElectionGuidDbToDomain = {
  electionGuid: 'electionGuid',
  votes: {
    key: 'votes',
    transform: elems => elems.map(el => ({ voteStatus: el.voteStatus, voteCount: el.voteCount }))
  }
};

const voteTopicReportByValidVoteCountTopicGuidForElectionGuidDbToDomain = {
  electionGuid: 'electionGuid',
  votes: {
    key: 'votes',
    transform: elems =>
      elems.map(el => ({
        topicGuid: el.topicGuid,
        topicTitle: el.topicTitle,
        voteCount: el.voteCount
      }))
  }
};

function VoteTopicMapper(auditMapper) {
  this.apiToDomain = function (apiVoteTopic) {
    return objectMapper(apiVoteTopic, voteTopicApiToDomain);
  };

  this.domainToApi = function (domainVoteTopic) {
    return objectMapper(domainVoteTopic, voteTopicDomainToApi);
  };

  this.domainToDb = function (domainVoteTopic) {
    return objectMapper(domainVoteTopic, voteTopicDomainToDb);
  };

  this.dbToDomain = function (dbVoteTopic) {
    return objectMapper(dbVoteTopic, voteTopicDbToDomain);
  };

  this.updateDomainToDb = function (domainVoteTopic) {
    return objectMapper(
      {
        ...domainVoteTopic,
        ...auditMapper.updateDomainAudit()
      },
      voteTopicDomainToDb
    );
  };

  this.reportByVoteStatusAndElectionGuidDbToDomain = function (electionGuid, votes) {
    return objectMapper(
      {
        electionGuid,
        votes
      },
      voteTopicReportByVoteStatusAndElectionGuidDbToDomain
    );
  };

  this.reportByValidVoteCountTopicGuidForElectionGuidDbToDomain = function (
    electionGuid,
    votes,
    electionTopics
  ) {
    const enrichedVotes = votes.map(vote => {
      const topic = electionTopics.find(
        electionTopic => electionTopic.topicGuid === vote.topicGuid
      );
      const { topicTitle } = topic;
      return {
        ...vote,
        topicTitle
      };
    });
    return objectMapper(
      {
        electionGuid,
        votes: enrichedVotes
      },
      voteTopicReportByValidVoteCountTopicGuidForElectionGuidDbToDomain
    );
  };
}

module.exports = VoteTopicMapper;
