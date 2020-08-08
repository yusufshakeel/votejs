'use strict';

const Mappers = require('../../../../app/mappers');
const ElectionCandidateDispatcher = require('../../../../app/dispatchers/election-candidate-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create election candidate', async () => {
  const repositories = {
    electionCandidateRepository: {
      create: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const electionCandidateDispatcher = new ElectionCandidateDispatcher({
    mappers,
    services,
    repositories
  });
  await electionCandidateDispatcher.createElectionCandidate({
    electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.electionCandidateRepository.create.mock.calls.length).toBe(1);
});

test('Should be able to fetch election candidate by guid', async () => {
  const repositories = {
    electionCandidateRepository: {
      findByGuid: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const electionCandidateDispatcher = new ElectionCandidateDispatcher({
    mappers,
    services,
    repositories
  });
  await electionCandidateDispatcher.findElectionCandidateByGuid(
    '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  );
  expect(repositories.electionCandidateRepository.findByGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election candidate by electionGuid', async () => {
  const repositories = {
    electionCandidateRepository: {
      findByElectionGuid: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const electionCandidateDispatcher = new ElectionCandidateDispatcher({
    mappers,
    services,
    repositories
  });
  await electionCandidateDispatcher.findElectionCandidateByElectionGuid(
    '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  );
  expect(repositories.electionCandidateRepository.findByElectionGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election candidate by candidateGuid', async () => {
  const repositories = {
    electionCandidateRepository: {
      findByCandidateGuid: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const electionCandidateDispatcher = new ElectionCandidateDispatcher({
    mappers,
    services,
    repositories
  });
  await electionCandidateDispatcher.findElectionCandidateByCandidateGuid(
    '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  );
  expect(repositories.electionCandidateRepository.findByCandidateGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election candidate by electionCandidateStatus', async () => {
  const repositories = {
    electionCandidateRepository: {
      findByElectionCandidateStatus: jest.fn(() => {
        return [
          {
            guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
          }
        ];
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const electionCandidateDispatcher = new ElectionCandidateDispatcher({
    mappers,
    services,
    repositories
  });
  await electionCandidateDispatcher.findElectionCandidateByElectionCandidateStatus({
    electionCandidateStatus: 'ACTIVE'
  });
  expect(
    repositories.electionCandidateRepository.findByElectionCandidateStatus.mock.calls.length
  ).toBe(1);
});

test('Should be able to update election candidate by electionCandidateGuid', async () => {
  const repositories = {
    electionCandidateRepository: {
      updateByGuid: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const electionCandidateDispatcher = new ElectionCandidateDispatcher({
    mappers,
    services,
    repositories
  });
  await electionCandidateDispatcher.updateElectionCandidateByGuid(
    '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    { electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b' }
  );
  expect(repositories.electionCandidateRepository.updateByGuid.mock.calls.length).toBe(1);
});
