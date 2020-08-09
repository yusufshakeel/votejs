'use strict';

function TopicDispatcher({ mappers, services, repositories }) {
  const { topicMapper } = mappers;
  const { topicRepository } = repositories;
  const { knexService } = services;

  this.createTopic = function (apiTopic) {
    return knexService.transaction(async txn => {
      const domainTopic = topicMapper.apiToDomain(apiTopic);
      const createdTopic = await topicRepository.create(domainTopic, txn);
      return topicMapper.domainToApi(createdTopic);
    });
  };

  this.findTopicByGuid = function (topicGuid) {
    return knexService.transaction(async txn => {
      const fetchedTopic = await topicRepository.findByGuid(topicGuid, txn);
      return topicMapper.domainToApi(fetchedTopic);
    });
  };

  this.findTopicByTopicStatus = function ({ topicStatus, limit, page }) {
    return knexService.transaction(async txn => {
      const result = await topicRepository.findByTopicStatus({ topicStatus, limit, page }, txn);
      return result.map(topic => topicMapper.domainToApi(topic));
    });
  };

  this.updateTopicByGuid = function (topicGuid, apiTopic) {
    return knexService.transaction(async txn => {
      const domainTopic = topicMapper.apiToDomain(apiTopic);
      const updatedTopic = await topicRepository.updateByGuid(topicGuid, domainTopic, txn);
      return topicMapper.domainToApi(updatedTopic);
    });
  };
}

module.exports = TopicDispatcher;
