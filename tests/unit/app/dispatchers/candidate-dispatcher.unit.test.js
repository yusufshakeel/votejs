'use strict';

const Mappers = require('../../../../app/mappers');
const CandidateDispatcher = require('../../../../app/dispatchers/candidate-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create candidate', async () => {
  const repositories = {
    candidateRepository: {
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
  const candidateDispatcher = new CandidateDispatcher({ mappers, services, repositories });
  await candidateDispatcher.createCandidate({
    guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.candidateRepository.create.mock.calls.length).toBe(1);
});

test('Should be able to fetch candidate by guid', async () => {
  const repositories = {
    candidateRepository: {
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
  const candidateDispatcher = new CandidateDispatcher({ mappers, services, repositories });
  await candidateDispatcher.findCandidateByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b');
  expect(repositories.candidateRepository.findByGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch candidate by candidateHandle', async () => {
  const repositories = {
    candidateRepository: {
      findByCandidateHandle: jest.fn(() => {
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
  const candidateDispatcher = new CandidateDispatcher({ mappers, services, repositories });
  await candidateDispatcher.findCandidateByCandidateHandle('janedoe');
  expect(repositories.candidateRepository.findByCandidateHandle.mock.calls.length).toBe(1);
});

test('Should be able to fetch candidate by candidateStatus', async () => {
  const repositories = {
    candidateRepository: {
      findByCandidateStatus: jest.fn(() => {
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
  const candidateDispatcher = new CandidateDispatcher({ mappers, services, repositories });
  await candidateDispatcher.findCandidateByCandidateStatus('ACTIVE');
  expect(repositories.candidateRepository.findByCandidateStatus.mock.calls.length).toBe(1);
});

test('Should be able to update candidate by guid', async () => {
  const repositories = {
    candidateRepository: {
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
  const candidateDispatcher = new CandidateDispatcher({ mappers, services, repositories });
  await candidateDispatcher.updateCandidate('9e17d7b7-c236-496f-92cd-10e1859fdd3b', {
    candidateHandle: 'janedoe'
  });
  expect(repositories.candidateRepository.updateByGuid.mock.calls.length).toBe(1);
});
