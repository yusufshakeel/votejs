'use strict';

const objectMapper = require('object-mapper');

const electionTopicDomainToDb = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  electionTopicStatus: 'electionTopicStatus',
  topicTitle: 'topicTitle',
  topicSummary: 'topicSummary',
  topicStatus: 'topicStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const electionTopicDbToDomain = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  electionTopicStatus: 'electionTopicStatus',
  topicTitle: 'topicTitle',
  topicSummary: 'topicSummary',
  topicStatus: 'topicStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

const electionTopicCountByElectionGuidDbToDomain = {
  electionGuid: 'electionGuid',
  topicCount: 'topicCount'
};

function ElectionTopicMapper(auditMapper) {
  this.domainToDb = function (domainElectionTopic) {
    return objectMapper(domainElectionTopic, electionTopicDomainToDb);
  };

  this.dbToDomain = function (dbElectionTopic) {
    return objectMapper(dbElectionTopic, electionTopicDbToDomain);
  };

  this.updateDomainToDb = function (domainElectionTopic) {
    return objectMapper(
      {
        ...domainElectionTopic,
        ...auditMapper.updateDomainAudit()
      },
      electionTopicDomainToDb
    );
  };

  this.countByElectionGuidDbToDomain = function (electionGuid, topicCount) {
    return objectMapper(
      {
        electionGuid,
        topicCount
      },
      electionTopicCountByElectionGuidDbToDomain
    );
  };
}

module.exports = ElectionTopicMapper;
