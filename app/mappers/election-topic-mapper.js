'use strict';

const objectMapper = require('object-mapper');

const electionTopicApiToDomain = {
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  electionTopicStatus: 'electionTopicStatus'
};

const electionTopicDomainToApi = {
  guid: 'guid',
  electionGuid: 'electionGuid',
  topicGuid: 'topicGuid',
  electionTopicStatus: 'electionTopicStatus',
  topicTitle: 'topicTitle',
  topicSummary: 'topicSummary',
  topicStatus: 'topicStatus',
  audit: 'audit'
};

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
  this.apiToDomain = function (apiElectionTopic) {
    return objectMapper(apiElectionTopic, electionTopicApiToDomain);
  };

  this.domainToApi = function (domainElectionTopic) {
    return objectMapper(domainElectionTopic, electionTopicDomainToApi);
  };

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
