'use strict';

const objectMapper = require('object-mapper');

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
