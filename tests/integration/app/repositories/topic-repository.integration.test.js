'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');
const TopicRepository = require('../../../../app/repositories/topic-repository.js');
const TopicMapper = require('../../../../app/mappers/topic-mapper.js');
const { TOPIC_STATUS_ACTIVE } = require('../../../../app/constants/topic-constants.js');

const services = new Services();
const { configService, knexService, uuidService, timeService } = services;

const now = timeService.now();
const DB_QUERY_LIMIT = configService.dbQueryLimit;

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.topicMapper = new TopicMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const topicRepository = new TopicRepository(mappers, configService);

const getFakeDomainTopic = (guid = uuidService.uuid()) => ({
  guid,
  title: `Some title ${guid}`,
  summary: 'summary',
  topicStatus: TOPIC_STATUS_ACTIVE,
  audit: {
    createdAt: now
  }
});

const getFakeDomainTopicResponse = guid => ({
  guid,
  title: `Some title ${guid}`,
  summary: 'summary',
  topicStatus: TOPIC_STATUS_ACTIVE,
  audit: {
    createdAt: now
  }
});

test('Should be able to create new topic', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await topicRepository.create(getFakeDomainTopic(guid), txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch topic by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await topicRepository.create(getFakeDomainTopic(guid), txn);
    const result = await topicRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(getFakeDomainTopicResponse(guid));
  });
});

test('Should return null if topic is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await topicRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch topic by topicStatus', async () => {
  return knexService.transaction(async txn => {
    const getFakeCandidate = () => getFakeDomainTopic(uuidService.uuid());
    await Promise.all([
      topicRepository.create(getFakeCandidate(), txn),
      topicRepository.create(getFakeCandidate(), txn),
      topicRepository.create(getFakeCandidate(), txn)
    ]);
    const fetchedTopics = await topicRepository.findByTopicStatus(
      { topicStatus: TOPIC_STATUS_ACTIVE, limit: 3, page: 1 },
      txn
    );
    expect(fetchedTopics.length).toBe(3);
    fetchedTopics.forEach(topic => {
      expect(topic.topicStatus).toBe(TOPIC_STATUS_ACTIVE);
    });
  });
});

test('Should return null if topic is not found - findByTopicStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await topicRepository.findByTopicStatus({ topicStatus: 'hahaha' }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to update topic', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainTopic = getFakeDomainTopic(guid);
    await topicRepository.create(fakeDomainTopic, txn);
    const dataToUpdate = {
      title: 'Updated title'
    };
    const result = await topicRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toStrictEqual({
      ...getFakeDomainTopicResponse(guid),
      audit: {
        createdAt: now,
        updatedAt: now
      },
      title: dataToUpdate.title
    });
  });
});

test('Should return null when updating topic that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      title: 'Updated title'
    };
    const result = await topicRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to find all topic without passing any params', async () => {
  return knexService.transaction(async txn => {
    const getFakeTopic = () => getFakeDomainTopic(uuidService.uuid());
    await Promise.all([
      topicRepository.create(getFakeTopic(), txn),
      topicRepository.create(getFakeTopic(), txn),
      topicRepository.create(getFakeTopic(), txn)
    ]);
    const fetchedTopics = await topicRepository.findAll({}, txn);
    expect(fetchedTopics.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedTopics.forEach(topic => {
      const allFields = keys(getFakeDomainTopicResponse());
      const isReturnedFieldsCorrect = keys(topic).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should be able to find all topic - with whereClause', async () => {
  return knexService.transaction(async txn => {
    const getFakeTopic = () => getFakeDomainTopic(uuidService.uuid());
    await Promise.all([
      topicRepository.create(getFakeTopic(), txn),
      topicRepository.create(getFakeTopic(), txn),
      topicRepository.create(getFakeTopic(), txn)
    ]);
    const fetchedTopics = await topicRepository.findAll(
      { whereClause: { topicStatus: TOPIC_STATUS_ACTIVE } },
      txn
    );
    expect(fetchedTopics.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedTopics.forEach(topic => {
      const allFields = keys(getFakeDomainTopicResponse());
      const isReturnedFieldsCorrect = keys(topic).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should return null if topic is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedTopics = await topicRepository.findAll(
      {
        whereClause: { topicStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedTopics).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
