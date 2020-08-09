'use strict';

const Mappers = require('../../../../app/mappers');
const ElectionTopicDispatcher = require('../../../../app/dispatchers/election-topic-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create election topic', async () => {
  const repositories = {
    electionTopicRepository: {
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
  const electionTopicDispatcher = new ElectionTopicDispatcher({
    mappers,
    services,
    repositories
  });
  await electionTopicDispatcher.createElectionTopic({
    electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.electionTopicRepository.create.mock.calls.length).toBe(1);
});

test('Should be able to fetch election topic by guid', async () => {
  const repositories = {
    electionTopicRepository: {
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
  const electionTopicDispatcher = new ElectionTopicDispatcher({
    mappers,
    services,
    repositories
  });
  await electionTopicDispatcher.findElectionTopicByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b');
  expect(repositories.electionTopicRepository.findByGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election topic by electionGuid', async () => {
  const repositories = {
    electionTopicRepository: {
      findByElectionGuid: jest.fn(() => {
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
  const electionTopicDispatcher = new ElectionTopicDispatcher({
    mappers,
    services,
    repositories
  });
  await electionTopicDispatcher.findElectionTopicByElectionGuid({
    electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.electionTopicRepository.findByElectionGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election topic by topicGuid', async () => {
  const repositories = {
    electionTopicRepository: {
      findByTopicGuid: jest.fn(() => {
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
  const electionTopicDispatcher = new ElectionTopicDispatcher({
    mappers,
    services,
    repositories
  });
  await electionTopicDispatcher.findElectionTopicByTopicGuid({
    topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.electionTopicRepository.findByTopicGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch election topic by electionTopicStatus', async () => {
  const repositories = {
    electionTopicRepository: {
      findByElectionTopicStatus: jest.fn(() => {
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
  const electionTopicDispatcher = new ElectionTopicDispatcher({
    mappers,
    services,
    repositories
  });
  await electionTopicDispatcher.findElectionTopicByElectionTopicStatus({
    electionTopicStatus: 'ACTIVE'
  });
  expect(repositories.electionTopicRepository.findByElectionTopicStatus.mock.calls.length).toBe(1);
});

test('Should be able to update election by guid', async () => {
  const repositories = {
    electionTopicRepository: {
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
  const electionTopicDispatcher = new ElectionTopicDispatcher({
    mappers,
    services,
    repositories
  });
  await electionTopicDispatcher.updateElectionTopicByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b', {
    electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.electionTopicRepository.updateByGuid.mock.calls.length).toBe(1);
});
