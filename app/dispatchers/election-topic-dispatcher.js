'use strict';

function ElectionTopicDispatcher({ mappers, services, repositories }) {
  const { electionTopicMapper } = mappers;
  const { electionTopicRepository } = repositories;
  const { knexService } = services;

  this.createElectionTopic = function (apiElectionTopic) {
    return knexService.transaction(async txn => {
      const domainElectionTopic = electionTopicMapper.apiToDomain(apiElectionTopic);
      const createdElectionTopic = await electionTopicRepository.create(domainElectionTopic, txn);
      return electionTopicMapper.domainToApi(createdElectionTopic);
    });
  };

  this.findElectionTopicByGuid = function (electionTopicGuid) {
    return knexService.transaction(async txn => {
      const fetchedElectionTopic = await electionTopicRepository.findByGuid(electionTopicGuid, txn);
      return electionTopicMapper.domainToApi(fetchedElectionTopic);
    });
  };

  this.findElectionTopicByElectionGuid = function ({ electionGuid, limit, page }) {
    return knexService.transaction(async txn => {
      const result = await electionTopicRepository.findByElectionGuid(
        { electionGuid, limit, page },
        txn
      );
      return result.map(electionTopic => electionTopicMapper.domainToApi(electionTopic));
    });
  };

  this.findElectionTopicByTopicGuid = function ({ topicGuid, limit, page }) {
    return knexService.transaction(async txn => {
      const result = await electionTopicRepository.findByTopicGuid({ topicGuid, limit, page }, txn);
      return result.map(electionTopic => electionTopicMapper.domainToApi(electionTopic));
    });
  };

  this.findElectionTopicByElectionTopicStatus = function ({ electionTopicStatus, limit, page }) {
    return knexService.transaction(async txn => {
      const result = await electionTopicRepository.findByElectionTopicStatus(
        { electionTopicStatus, limit, page },
        txn
      );
      return result.map(electionTopic => electionTopicMapper.domainToApi(electionTopic));
    });
  };

  this.updateElectionTopicByGuid = function (electionTopicGuid, apiElectionTopic) {
    return knexService.transaction(async txn => {
      const domainElectionTopic = electionTopicMapper.apiToDomain(apiElectionTopic);
      const updatedElectionTopic = await electionTopicRepository.updateByGuid(
        electionTopicGuid,
        domainElectionTopic,
        txn
      );
      return electionTopicMapper.domainToApi(updatedElectionTopic);
    });
  };
}

module.exports = ElectionTopicDispatcher;
