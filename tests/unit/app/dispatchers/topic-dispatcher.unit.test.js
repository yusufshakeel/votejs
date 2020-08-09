'use strict';

const Mappers = require('../../../../app/mappers');
const TopicDispatcher = require('../../../../app/dispatchers/topic-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create topic', async () => {
  const repositories = {
    topicRepository: {
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
  const topicDispatcher = new TopicDispatcher({
    mappers,
    services,
    repositories
  });
  await topicDispatcher.createTopic({
    topic: 'Some topic'
  });
  expect(repositories.topicRepository.create.mock.calls.length).toBe(1);
});

test('Should be able to fetch topic by guid', async () => {
  const repositories = {
    topicRepository: {
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
  const topicDispatcher = new TopicDispatcher({
    mappers,
    services,
    repositories
  });
  await topicDispatcher.findTopicByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b');
  expect(repositories.topicRepository.findByGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch topic by topicStatus', async () => {
  const repositories = {
    topicRepository: {
      findByTopicStatus: jest.fn(() => {
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
  const topicDispatcher = new TopicDispatcher({
    mappers,
    services,
    repositories
  });
  await topicDispatcher.findTopicByTopicStatus({
    topicStatus: 'ACTIVE'
  });
  expect(repositories.topicRepository.findByTopicStatus.mock.calls.length).toBe(1);
});

test('Should be able to update topic by guid', async () => {
  const repositories = {
    topicRepository: {
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
  const topicDispatcher = new TopicDispatcher({
    mappers,
    services,
    repositories
  });
  await topicDispatcher.updateTopicByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b', {
    title: 'Some title'
  });
  expect(repositories.topicRepository.updateByGuid.mock.calls.length).toBe(1);
});
