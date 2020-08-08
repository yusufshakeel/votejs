'use strict';

function CandidateDispatcher({ mappers, services, repositories }) {
  const { candidateMapper } = mappers;
  const { candidateRepository } = repositories;
  const { knexService } = services;

  this.createCandidate = function (apiCandidate) {
    return knexService.transaction(async txn => {
      const domainCandidate = candidateMapper.apiToDomain(apiCandidate);
      const createdCandidate = await candidateRepository.create(domainCandidate, txn);
      return candidateMapper.domainToApi(createdCandidate);
    });
  };

  this.findCandidateByGuid = function (guid) {
    return knexService.transaction(async txn => {
      const fetchedCandidate = await candidateRepository.findByGuid(guid, txn);
      return candidateMapper.domainToApi(fetchedCandidate);
    });
  };

  this.findCandidateByCandidateHandle = function (candidateHandle) {
    return knexService.transaction(async txn => {
      const fetchedCandidate = await candidateRepository.findByCandidateHandle(
        candidateHandle,
        txn
      );
      return candidateMapper.domainToApi(fetchedCandidate);
    });
  };

  this.findCandidateByCandidateStatus = function ({ candidateStatus, limit, page }) {
    return knexService.transaction(async txn => {
      const fetchedCandidates = await candidateRepository.findByCandidateStatus(
        { candidateStatus, limit, page },
        txn
      );
      return fetchedCandidates.map(fetchedCandidate =>
        candidateMapper.domainToApi(fetchedCandidate)
      );
    });
  };

  this.updateCandidate = function (candidateGuid, apiCandidate) {
    return knexService.transaction(async txn => {
      const domainCandidate = candidateMapper.apiToDomain(apiCandidate);
      const updatedCandidate = await candidateRepository.updateByGuid(
        candidateGuid,
        domainCandidate,
        txn
      );
      return candidateMapper.domainToApi(updatedCandidate);
    });
  };
}

module.exports = CandidateDispatcher;
