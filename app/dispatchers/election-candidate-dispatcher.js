'use strict';

function ElectionCandidateDispatcher({ mappers, services, repositories }) {
  const { electionCandidateMapper } = mappers;
  const { electionCandidateRepository } = repositories;
  const { knexService } = services;

  this.createElectionCandidate = function (apiElectionCandidate) {
    return knexService.transaction(async txn => {
      const domainElectionCandidate = electionCandidateMapper.apiToDomain(apiElectionCandidate);
      const createdElectionCandidate = await electionCandidateRepository.create(
        domainElectionCandidate,
        txn
      );
      return electionCandidateMapper.domainToApi(createdElectionCandidate);
    });
  };

  this.findElectionCandidateByGuid = function (electionCandidateGuid) {
    return knexService.transaction(async txn => {
      const fetchedElectionCandidate = await electionCandidateRepository.findByGuid(
        electionCandidateGuid,
        txn
      );
      return electionCandidateMapper.domainToApi(fetchedElectionCandidate);
    });
  };

  this.findElectionCandidateByElectionGuid = function (electionGuid) {
    return knexService.transaction(async txn => {
      const fetchedElectionCandidate = await electionCandidateRepository.findByElectionGuid(
        electionGuid,
        txn
      );
      return electionCandidateMapper.domainToApi(fetchedElectionCandidate);
    });
  };

  this.findElectionCandidateByCandidateGuid = function (candidateGuid) {
    return knexService.transaction(async txn => {
      const fetchedElectionCandidate = await electionCandidateRepository.findByCandidateGuid(
        candidateGuid,
        txn
      );
      return electionCandidateMapper.domainToApi(fetchedElectionCandidate);
    });
  };

  this.findElectionCandidateByElectionCandidateStatus = function ({
    electionCandidateStatus,
    limit,
    page
  }) {
    return knexService.transaction(async txn => {
      const result = await electionCandidateRepository.findByElectionCandidateStatus(
        { electionCandidateStatus, limit, page },
        txn
      );
      return result.map(electionCandidate =>
        electionCandidateMapper.domainToApi(electionCandidate)
      );
    });
  };

  this.updateElectionCandidateByGuid = function (electionCandidateGuid, apiElectionCandidate) {
    return knexService.transaction(async txn => {
      const domainElectionCandidate = electionCandidateMapper.apiToDomain(apiElectionCandidate);
      const updatedElectionCandidate = await electionCandidateRepository.updateByGuid(
        electionCandidateGuid,
        domainElectionCandidate,
        txn
      );
      return electionCandidateMapper.domainToApi(updatedElectionCandidate);
    });
  };
}

module.exports = ElectionCandidateDispatcher;
