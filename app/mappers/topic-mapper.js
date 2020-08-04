'use strict';

const objectMapper = require('object-mapper');

const topicApiToDomain = {
  title: 'title',
  summary: 'summary',
  topicStatus: 'topicStatus'
};

const topicDomainToApi = {
  guid: 'guid',
  title: 'title',
  summary: 'summary',
  topicStatus: 'topicStatus',
  audit: 'audit'
};

const topicDomainToDb = {
  guid: 'guid',
  title: 'title',
  summary: 'summary',
  topicStatus: 'topicStatus',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const topicDbToDomain = {
  guid: 'guid',
  title: 'title',
  summary: 'summary',
  topicStatus: 'topicStatus',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function TopicMapper(auditMapper) {
  this.apiToDomain = function (apiTopic) {
    return objectMapper(apiTopic, topicApiToDomain);
  };

  this.domainToApi = function (domainTopic) {
    return objectMapper(domainTopic, topicDomainToApi);
  };

  this.domainToDb = function (domainTopic) {
    return objectMapper(domainTopic, topicDomainToDb);
  };

  this.dbToDomain = function (dbTopic) {
    return objectMapper(dbTopic, topicDbToDomain);
  };

  this.updateDomainToDb = function (domainTopic) {
    return objectMapper(
      {
        ...domainTopic,
        ...auditMapper.updateDomainAudit()
      },
      topicDomainToDb
    );
  };
}

module.exports = TopicMapper;
