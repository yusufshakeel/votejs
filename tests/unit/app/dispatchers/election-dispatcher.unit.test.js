'use strict';

const Mappers = require('../../../../app/mappers');
const ElectionDispatcher = require('../../../../app/dispatchers/election-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create election', async () => {
  const repositories = {
    electionRepository: {
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
  const electionDispatcher = new ElectionDispatcher({
    mappers,
    services,
    repositories
  });
  await electionDispatcher.createElection({
    title: 'Some title'
  });
  expect(repositories.electionRepository.create.mock.calls.length).toBe(1);
});

test('Should be able to fetch election by electionGuid', async () => {
  const repositories = {
    electionRepository: {
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
  const electionDispatcher = new ElectionDispatcher({
    mappers,
    services,
    repositories
  });
  await electionDispatcher.findElectionByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b');
  expect(repositories.electionRepository.findByGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election by electionStatus', async () => {
  const repositories = {
    electionRepository: {
      findByElectionStatus: jest.fn(() => {
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
  const electionDispatcher = new ElectionDispatcher({
    mappers,
    services,
    repositories
  });
  await electionDispatcher.findElectionByElectionStatus({
    electionStatus: 'ACTIVE'
  });
  expect(repositories.electionRepository.findByElectionStatus.mock.calls.length).toBe(1);
});

test('Should be able to update election by electionGuid', async () => {
  const repositories = {
    electionRepository: {
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
  const electionDispatcher = new ElectionDispatcher({
    mappers,
    services,
    repositories
  });
  await electionDispatcher.updateElectionByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b', {
    title: 'Some title'
  });
  expect(repositories.electionRepository.updateByGuid.mock.calls.length).toBe(1);
});
