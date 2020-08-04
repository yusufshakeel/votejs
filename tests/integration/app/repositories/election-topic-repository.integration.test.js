'use strict';

const Services = require('../../../../app/services');
const { update } = require('../../../../app/functional');
const TopicRepository = require('../../../../app/repositories/topic-repository.js');
const ElectionRepository = require('../../../../app/repositories/election-repository.js');
const ElectionTopicRepository = require('../../../../app/repositories/election-topic-repository.js');
const TopicMapper = require('../../../../app/mappers/topic-mapper.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');
const ElectionTopicMapper = require('../../../../app/mappers/election-topic-mapper.js');

const {
  ELECTION_TOPIC_STATUS_ACTIVE,
  ELECTION_TOPIC_STATUS_INACTIVE
} = require('../../../../app/constants/election-topic-constants.js');

const { ELECTION_STATUS_PUBLIC } = require('../../../../app/constants/election-constants.js');

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
  this.electionMapper = new ElectionMapper(this.auditMapper);
  this.electionTopicMapper = new ElectionTopicMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const topicRepository = new TopicRepository(mappers, configService);
const electionRepository = new ElectionRepository(mappers, configService);
const electionTopicRepository = new ElectionTopicRepository(mappers, configService);

const getFakeDomainElection = (guid = uuidService.uuid()) => ({
  guid,
  title: `Election Title ${guid}`,
  summary: `Election summary ${guid}`,
  startsAt: now,
  endsAt: now,
  electionStatus: ELECTION_STATUS_PUBLIC,
  electionSettings: {
    field: 'value'
  },
  audit: {
    createdAt: now
  }
});

const getFakeDomainTopic = (guid = uuidService.uuid()) => ({
  guid,
  title: `Some title ${guid}`,
  summary: 'summary',
  topicStatus: TOPIC_STATUS_ACTIVE,
  audit: {
    createdAt: now
  }
});

const getFakeDomainElectionTopic = ({ guid = uuidService.uuid(), electionGuid, topicGuid }) => ({
  guid,
  electionGuid,
  topicGuid,
  electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
});

const getFakeDomainElectionTopicResponse = (guid, electionGuid, topicGuid) => ({
  guid,
  electionGuid,
  topicGuid,
  electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
});

const fakeDomainElections = [
  getFakeDomainElection(),
  getFakeDomainElection(),
  getFakeDomainElection(),
  getFakeDomainElection()
];

const fakeDomainTopics = [getFakeDomainTopic(), getFakeDomainTopic(), getFakeDomainTopic()];

const fakeDomainElectionTopics = [
  // election topic #1 -- consists of -- election #1, topic #1
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[0].guid,
    topicGuid: fakeDomainTopics[0].guid
  }),
  // election topic #2 -- consists of -- election #1, topic #2
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[0].guid,
    topicGuid: fakeDomainTopics[1].guid
  }),
  // election topic #3 -- consists of -- election #2, topic #1
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[1].guid,
    topicGuid: fakeDomainTopics[0].guid
  }),
  // election topic #4 -- consists of -- election #2, topic #3
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[1].guid,
    topicGuid: fakeDomainTopics[2].guid
  }),
  // election topic #5 -- consists of -- election #3, topic #1 -- this is for update test
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[2].guid,
    topicGuid: fakeDomainTopics[0].guid
  }),
  // election topic #6 -- consists of -- election #3, topic #3 -- this is for upsert test
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[2].guid,
    topicGuid: fakeDomainTopics[2].guid
  }),
  // election topic #7 -- consists of -- election #4, topic #1 -- for count
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[3].guid,
    topicGuid: fakeDomainTopics[0].guid
  }),
  // election topic #8 -- consists of -- election #4, topic #2 -- for count
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[3].guid,
    topicGuid: fakeDomainTopics[1].guid
  }),
  // election topic #9 -- consists of -- election #4, topic #3 -- for count
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[3].guid,
    topicGuid: fakeDomainTopics[2].guid
  })
];

beforeAll(() => {
  return knexService.transaction(async txn => {
    await Promise.all([
      electionRepository.create(fakeDomainElections[0], txn),
      electionRepository.create(fakeDomainElections[1], txn),
      electionRepository.create(fakeDomainElections[2], txn),
      electionRepository.create(fakeDomainElections[3], txn)
    ]);
    await Promise.all([
      topicRepository.create(fakeDomainTopics[0], txn),
      topicRepository.create(fakeDomainTopics[1], txn),
      topicRepository.create(fakeDomainTopics[2], txn)
    ]);

    // for count
    await Promise.all([
      electionTopicRepository.create(fakeDomainElectionTopics[6], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[7], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[8], txn)
    ]);
  });
});

test('Should be able to create new election topic', async () => {
  return knexService.transaction(async txn => {
    const electionTopics = await Promise.all([
      electionTopicRepository.create(fakeDomainElectionTopics[0], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[1], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[2], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[3], txn)
    ]);
    electionTopics.forEach((electionTopic, index) => {
      expect(electionTopic.electionGuid).toBe(fakeDomainElectionTopics[index].electionGuid);
      expect(electionTopic.topicGuid).toBe(fakeDomainElectionTopics[index].topicGuid);
      expect(fakeDomainElectionTopics[index]).toStrictEqual(
        getFakeDomainElectionTopicResponse(
          fakeDomainElectionTopics[index].guid,
          fakeDomainElectionTopics[index].electionGuid,
          fakeDomainElectionTopics[index].topicGuid
        )
      );
    });
  });
});

test('Should be able to create new election topic - upsert', async () => {
  return knexService.transaction(async txn => {
    const electionTopic = await electionTopicRepository.upsert(fakeDomainElectionTopics[5], txn);
    expect(electionTopic).toStrictEqual(
      getFakeDomainElectionTopicResponse(
        fakeDomainElectionTopics[5].guid,
        fakeDomainElectionTopics[5].electionGuid,
        fakeDomainElectionTopics[5].topicGuid
      )
    );
  });
});

test('Should be able to update existing election topic - upsert', async () => {
  return knexService.transaction(async txn => {
    const electionTopics = await Promise.all([
      electionTopicRepository.upsert(fakeDomainElectionTopics[0], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[1], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[2], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[3], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[4], txn)
    ]);
    electionTopics.forEach((electionTopics, index) => {
      expect(electionTopics.electionGuid).toBe(fakeDomainElectionTopics[index].electionGuid);
      expect(electionTopics.topicGuid).toBe(fakeDomainElectionTopics[index].topicGuid);
      expect(fakeDomainElectionTopics[index]).toStrictEqual(
        getFakeDomainElectionTopicResponse(
          fakeDomainElectionTopics[index].guid,
          fakeDomainElectionTopics[index].electionGuid,
          fakeDomainElectionTopics[index].topicGuid
        )
      );
    });
  });
});

test('Should be able to fetch election topic by guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionTopicRepository.findByGuid(fakeDomainElectionTopics[0].guid, txn);
    const expected = update(
      getFakeDomainElectionTopicResponse(
        fakeDomainElectionTopics[0].guid,
        fakeDomainElectionTopics[0].electionGuid,
        fakeDomainElectionTopics[0].topicGuid
      ),
      {
        topicTitle: { $set: fakeDomainTopics[0].title },
        topicStatus: { $set: fakeDomainTopics[0].topicStatus },
        topicSummary: { $set: fakeDomainTopics[0].summary }
      }
    );
    expect(result).toStrictEqual(expected);
  });
});

test('Should return null if election topic is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionTopicRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election topic by election guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionTopicRepository.findByElectionGuid(
      { electionGuid: fakeDomainElections[0].guid },
      txn
    );
    const expected = [
      update(fakeDomainElectionTopics[0], {
        topicTitle: { $set: fakeDomainTopics[0].title },
        topicStatus: { $set: fakeDomainTopics[0].topicStatus },
        topicSummary: { $set: fakeDomainTopics[0].summary }
      }),
      update(fakeDomainElectionTopics[1], {
        topicTitle: { $set: fakeDomainTopics[1].title },
        topicStatus: { $set: fakeDomainTopics[1].topicStatus },
        topicSummary: { $set: fakeDomainTopics[1].summary }
      })
    ].sort();
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    expect(result.sort()).toStrictEqual(expected);
  });
});

test('Should return null if election topic is not found - findByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionTopicRepository.findByElectionGuid({ electionGuid: guid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election topic by topic guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionTopicRepository.findByTopicGuid(
      { topicGuid: fakeDomainTopics[0].guid },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    result.forEach(electionCandidate => {
      expect(electionCandidate.topicGuid).toBe(fakeDomainTopics[0].guid);
    });
  });
});

test('Should return null if election topic is not found - findByTopicGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionTopicRepository.findByTopicGuid({ topicGuid: guid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election topic by findByElectionTopicStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await electionTopicRepository.findByElectionTopicStatus(
      { electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    result.forEach(electionCandidate => {
      expect(electionCandidate.electionTopicStatus).toBe(ELECTION_TOPIC_STATUS_ACTIVE);
    });
  });
});

test('Should return null if election topic is not found - findByElectionTopicStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await electionTopicRepository.findByElectionTopicStatus(
      { electionTopicStatus: 'hahaha' },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to update election topic', async () => {
  return knexService.transaction(async txn => {
    await electionTopicRepository.upsert(fakeDomainElectionTopics[4], txn);
    const dataToUpdate = {
      electionTopicStatus: ELECTION_TOPIC_STATUS_INACTIVE
    };
    const result = await electionTopicRepository.updateByGuid(
      fakeDomainElectionTopics[4].guid,
      dataToUpdate,
      txn
    );
    expect(result).toStrictEqual({
      ...fakeDomainElectionTopics[4],
      ...dataToUpdate,
      audit: {
        createdAt: now,
        updatedAt: now
      }
    });
  });
});

test('Should return null when updating election topic that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE
    };
    const result = await electionTopicRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to find all election topic without passing any params', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      electionTopicRepository.upsert(fakeDomainElectionTopics[0], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[1], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[2], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[3], txn),
      electionTopicRepository.upsert(fakeDomainElectionTopics[4], txn)
    ]);
    const fetchedElectionCandidates = await electionTopicRepository.findAll({}, txn);
    expect(fetchedElectionCandidates.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
  });
});

test('Should return null if election topic is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedElectionCandidates = await electionTopicRepository.findAll(
      {
        whereClause: { electionTopicStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedElectionCandidates).toBeNull();
  });
});

test('Should be able to count topics by electionGuid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionTopicRepository.countByElectionGuid(
      fakeDomainElections[3].guid,
      txn
    );
    expect(result).toStrictEqual({
      electionGuid: fakeDomainElections[3].guid,
      topicCount: '3'
    });
  });
});

test('Should return 0 as topicCount if election topic is not found = countByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionTopicRepository.countByElectionGuid(guid, txn);
    expect(result).toStrictEqual({
      electionGuid: guid,
      topicCount: '0'
    });
  });
});

afterAll(() => {
  return knexService.destroy();
});
