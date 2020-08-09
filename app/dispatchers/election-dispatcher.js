'use strict';

function ElectionDispatcher({ mappers, services, repositories }) {
  const { electionMapper } = mappers;
  const { electionRepository } = repositories;
  const { knexService } = services;

  this.createElection = function (apiElection) {
    return knexService.transaction(async txn => {
      const domainElection = electionMapper.apiToDomain(apiElection);
      const createdElection = await electionRepository.create(domainElection, txn);
      return electionMapper.domainToApi(createdElection);
    });
  };

  this.findElectionByGuid = function (electionGuid) {
    return knexService.transaction(async txn => {
      const fetchedElection = await electionRepository.findByGuid(electionGuid, txn);
      return electionMapper.domainToApi(fetchedElection);
    });
  };

  this.findElectionByElectionStatus = function ({ electionStatus, limit, page }) {
    return knexService.transaction(async txn => {
      const result = await electionRepository.findByElectionStatus(
        { electionStatus, limit, page },
        txn
      );
      return result.map(election => electionMapper.domainToApi(election));
    });
  };

  this.updateElectionByGuid = function (electionGuid, apiElection) {
    return knexService.transaction(async txn => {
      const domainElection = electionMapper.apiToDomain(apiElection);
      const updatedElection = await electionRepository.updateByGuid(
        electionGuid,
        domainElection,
        txn
      );
      return electionMapper.domainToApi(updatedElection);
    });
  };
}

module.exports = ElectionDispatcher;
