'use strict';

const Services = require('../../../../app/services');
const TopicRepository = require('../../../../app/repositories/topic-repository.js');
const ElectionRepository = require('../../../../app/repositories/election-repository.js');
const ElectionTopicRepository = require('../../../../app/repositories/election-topic-repository.js');
const VoterRepository = require('../../../../app/repositories/voter-repository.js');
const VoteTopicRepository = require('../../../../app/repositories/vote-topic-repository.js');
const TopicMapper = require('../../../../app/mappers/topic-mapper.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');
const ElectionTopicMapper = require('../../../../app/mappers/election-topic-mapper.js');
const VoterMapper = require('../../../../app/mappers/voter-mapper.js');
const VoteTopicMapper = require('../../../../app/mappers/vote-topic-mapper.js');

const { VOTER_ACCOUNT_STATUS_ACTIVE } = require('../../../../app/constants/voter-constants.js');

const {
  ELECTION_TOPIC_STATUS_ACTIVE
} = require('../../../../app/constants/election-topic-constants.js');

const { ELECTION_STATUS_PUBLIC } = require('../../../../app/constants/election-constants.js');

const { TOPIC_STATUS_ACTIVE } = require('../../../../app/constants/topic-constants.js');

const {
  VOTE_TOPIC_VOTE_STATUS_VALID,
  VOTE_TOPIC_VOTE_STATUS_INVALID,
  VOTE_TOPIC_VOTE_STATUS_REVERTED,
  VOTE_TOPIC_VOTE_STATUS_DELETED
} = require('../../../../app/constants/vote-topic-constants.js');

const services = new Services();
const { configService, knexService, uuidService, timeService, passwordService } = services;

const now = timeService.now();

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
  this.voterMapper = new VoterMapper(this.auditMapper);
  this.voteTopicMapper = new VoteTopicMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const topicRepository = new TopicRepository(mappers, configService);
const electionRepository = new ElectionRepository(mappers, configService);
const electionTopicRepository = new ElectionTopicRepository(mappers, configService);
const voterRepository = new VoterRepository(mappers, configService, passwordService);
const voteTopicRepository = new VoteTopicRepository(mappers, configService, {
  electionTopicRepository
});

const getFakeDomainVoter = ({
  guid = uuidService.uuid(),
  firstName,
  middleName,
  lastName,
  gender
}) => ({
  guid,
  firstName,
  middleName,
  lastName,
  gender,
  emailId: `${guid}@example.com`,
  userName: `${guid}`,
  password: 'root1234',
  passcode: '123456',
  accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE,
  countryCode: 'IND',
  audit: {
    createdAt: now
  }
});

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
  summary: `Some summary ${guid}`,
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

const fakeDomainVoters = [
  getFakeDomainVoter({
    firstName: 'Jane',
    middleName: 'Super',
    lastName: 'Doe',
    gender: 'FEMALE'
  }),
  getFakeDomainVoter({
    firstName: 'John',
    middleName: 'Super',
    lastName: 'Doe',
    gender: 'MALE'
  }),
  getFakeDomainVoter({
    firstName: 'Joy',
    middleName: 'Super',
    lastName: 'Doe',
    gender: 'MALE'
  }),
  getFakeDomainVoter({
    firstName: 'Jim',
    middleName: 'Super',
    lastName: 'Doe',
    gender: 'MALE'
  }),
  getFakeDomainVoter({
    firstName: 'Jack',
    middleName: 'Super',
    lastName: 'Doe',
    gender: 'MALE'
  })
];

const fakeDomainElections = [getFakeDomainElection(), getFakeDomainElection()];

const fakeDomainTopics = [getFakeDomainTopic(), getFakeDomainTopic()];

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
  // election topic #3 -- consists of -- election #2, topic #1 - for report work
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[1].guid,
    topicGuid: fakeDomainTopics[0].guid
  }),
  // election topic #4 -- consists of -- election #2, topic #2 - for report work
  getFakeDomainElectionTopic({
    electionGuid: fakeDomainElections[1].guid,
    topicGuid: fakeDomainTopics[1].guid
  })
];

beforeAll(() => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voterRepository.create(fakeDomainVoters[0], txn),
      voterRepository.create(fakeDomainVoters[1], txn),
      voterRepository.create(fakeDomainVoters[2], txn),
      voterRepository.create(fakeDomainVoters[3], txn),
      voterRepository.create(fakeDomainVoters[4], txn)
    ]);
    await Promise.all([
      electionRepository.create(fakeDomainElections[0], txn),
      electionRepository.create(fakeDomainElections[1], txn)
    ]);
    await Promise.all([
      topicRepository.create(fakeDomainTopics[0], txn),
      topicRepository.create(fakeDomainTopics[1], txn)
    ]);
    await Promise.all([
      electionTopicRepository.create(fakeDomainElectionTopics[0], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[1], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[2], txn),
      electionTopicRepository.create(fakeDomainElectionTopics[3], txn)
    ]);

    // ----------- for report
    await voteTopicRepository.invalidVote(
      (
        await voteTopicRepository.create(
          getFakeVoteTopic({
            electionGuid: fakeDomainElectionTopics[2].electionGuid,
            topicGuid: fakeDomainElectionTopics[2].topicGuid,
            voterGuid: fakeDomainVoters[0].guid
          }),
          txn
        )
      ).guid,
      txn
    );
    await voteTopicRepository.revertVote(
      (
        await voteTopicRepository.create(
          getFakeVoteTopic({
            electionGuid: fakeDomainElectionTopics[2].electionGuid,
            topicGuid: fakeDomainElectionTopics[2].topicGuid,
            voterGuid: fakeDomainVoters[0].guid
          }),
          txn
        )
      ).guid,
      txn
    );
    await voteTopicRepository.deleteVote(
      (
        await voteTopicRepository.create(
          getFakeVoteTopic({
            electionGuid: fakeDomainElectionTopics[2].electionGuid,
            topicGuid: fakeDomainElectionTopics[2].topicGuid,
            voterGuid: fakeDomainVoters[0].guid
          }),
          txn
        )
      ).guid,
      txn
    );
    await Promise.all([
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[2].electionGuid,
          topicGuid: fakeDomainElectionTopics[2].topicGuid,
          voterGuid: fakeDomainVoters[0].guid
        }),
        txn
      ),
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[2].electionGuid,
          topicGuid: fakeDomainElectionTopics[2].topicGuid,
          voterGuid: fakeDomainVoters[1].guid
        }),
        txn
      ),
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[3].electionGuid,
          topicGuid: fakeDomainElectionTopics[3].topicGuid,
          voterGuid: fakeDomainVoters[2].guid
        }),
        txn
      ),
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[3].electionGuid,
          topicGuid: fakeDomainElectionTopics[3].topicGuid,
          voterGuid: fakeDomainVoters[3].guid
        }),
        txn
      ),
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[3].electionGuid,
          topicGuid: fakeDomainElectionTopics[3].topicGuid,
          voterGuid: fakeDomainVoters[4].guid
        }),
        txn
      )
    ]);
  });
});

const getFakeVoteTopic = ({ guid = uuidService.uuid(), electionGuid, topicGuid, voterGuid }) => ({
  guid,
  electionGuid,
  topicGuid,
  voterGuid,
  voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID,
  audit: {
    createdAt: now
  }
});

const getFakeVoteTopicResponse = ({ guid, electionGuid, topicGuid, voterGuid }) => ({
  guid,
  electionGuid,
  topicGuid,
  voterGuid,
  voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID,
  audit: {
    createdAt: now
  }
});

test('Should be able to create new vote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const domainVoteTopic = getFakeVoteTopic({
      guid,
      electionGuid: fakeDomainElectionTopics[0].electionGuid,
      topicGuid: fakeDomainElectionTopics[0].topicGuid,
      voterGuid: fakeDomainVoters[0].guid,
      voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
    });
    const result = await voteTopicRepository.create(domainVoteTopic, txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch vote topic by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const domainVoteTopic = getFakeVoteTopic({
      guid,
      electionGuid: fakeDomainElectionTopics[0].electionGuid,
      topicGuid: fakeDomainElectionTopics[0].topicGuid,
      voterGuid: fakeDomainVoters[0].guid,
      voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
    });
    await voteTopicRepository.create(domainVoteTopic, txn);
    const result = await voteTopicRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(
      getFakeVoteTopicResponse({
        guid,
        electionGuid: fakeDomainElectionTopics[0].electionGuid,
        topicGuid: fakeDomainElectionTopics[0].topicGuid,
        voterGuid: fakeDomainVoters[0].guid
      })
    );
  });
});

test('Should return null if vote topic is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote topic by voteStatus', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[0].electionGuid,
          topicGuid: fakeDomainElectionTopics[0].topicGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteTopics = await voteTopicRepository.findByVoteStatus(
      { voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteTopics.length).toBe(3);
    fetchedVoteTopics.forEach(voteTopic => {
      expect(voteTopic.voteStatus).toBe(VOTE_TOPIC_VOTE_STATUS_VALID);
    });
  });
});

test('Should return null if vote topic is not found - findByVoteStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await voteTopicRepository.findByVoteStatus({ voteStatus: 'hahaha' }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote topic by electionGuid', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[0].electionGuid,
          topicGuid: fakeDomainElectionTopics[0].topicGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteTopics = await voteTopicRepository.findByElectionGuid(
      { electionGuid: fakeDomainElectionTopics[0].electionGuid, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteTopics.length).toBeLessThanOrEqual(3);
    fetchedVoteTopics.forEach(voteTopic => {
      expect(voteTopic.electionGuid).toBe(fakeDomainElectionTopics[0].electionGuid);
    });
  });
});

test('Should return null if vote topic is not found - findByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const electionGuid = uuidService.uuid();
    const result = await voteTopicRepository.findByElectionGuid({ electionGuid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote topic by voterGuid', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[0].electionGuid,
          topicGuid: fakeDomainElectionTopics[0].topicGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteTopics = await voteTopicRepository.findByVoterGuid(
      { voterGuid: fakeDomainVoters[0].guid, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteTopics.length).toBeLessThanOrEqual(3);
    fetchedVoteTopics.forEach(voteTopic => {
      expect(voteTopic.voterGuid).toBe(fakeDomainVoters[0].guid);
    });
  });
});

test('Should return null if vote topic is not found - findByVoterGuid', async () => {
  return knexService.transaction(async txn => {
    const voterGuid = uuidService.uuid();
    const result = await voteTopicRepository.findByVoterGuid({ voterGuid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote topic by topicGuid', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteTopicRepository.create(
        getFakeVoteTopic({
          electionGuid: fakeDomainElectionTopics[0].electionGuid,
          topicGuid: fakeDomainElectionTopics[0].topicGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteTopics = await voteTopicRepository.findByTopicGuid(
      { topicGuid: fakeDomainElectionTopics[0].topicGuid, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteTopics.length).toBeLessThanOrEqual(3);
    fetchedVoteTopics.forEach(voteTopic => {
      expect(voteTopic.topicGuid).toBe(fakeDomainElectionTopics[0].topicGuid);
    });
  });
});

test('Should return null if vote topic is not found - findByTopicGuid', async () => {
  return knexService.transaction(async txn => {
    const topicGuid = uuidService.uuid();
    const result = await voteTopicRepository.findByTopicGuid({ topicGuid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote invalid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteTopicRepository.create(
      getFakeVoteTopic({
        guid,
        electionGuid: fakeDomainElectionTopics[0].electionGuid,
        topicGuid: fakeDomainElectionTopics[0].topicGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
      }),
      txn
    );
    const result = await voteTopicRepository.invalidVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_TOPIC_VOTE_STATUS_INVALID);
  });
});

test('Should return null if vote topic is not found - invalidVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.invalidVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote valid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteTopicRepository.create(
      getFakeVoteTopic({
        guid,
        electionGuid: fakeDomainElectionTopics[0].electionGuid,
        topicGuid: fakeDomainElectionTopics[0].topicGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_TOPIC_VOTE_STATUS_INVALID
      }),
      txn
    );
    const result = await voteTopicRepository.validVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_TOPIC_VOTE_STATUS_VALID);
  });
});

test('Should return null if vote topic is not found - validVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.validVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote reverted', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteTopicRepository.create(
      getFakeVoteTopic({
        guid,
        electionGuid: fakeDomainElectionTopics[0].electionGuid,
        topicGuid: fakeDomainElectionTopics[0].topicGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
      }),
      txn
    );
    const result = await voteTopicRepository.revertVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_TOPIC_VOTE_STATUS_REVERTED);
  });
});

test('Should return null if vote topic is not found - revertVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.revertVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote deleted', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteTopicRepository.create(
      getFakeVoteTopic({
        guid,
        electionGuid: fakeDomainElectionTopics[0].electionGuid,
        topicGuid: fakeDomainElectionTopics[0].topicGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID
      }),
      txn
    );
    const result = await voteTopicRepository.deleteVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_TOPIC_VOTE_STATUS_DELETED);
  });
});

test('Should return null if vote topic is not found - deleteVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.deleteVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to report voting result by voteStatus for electionGuid', async () => {
  return knexService.transaction(async txn => {
    const result = await voteTopicRepository.reportByVoteStatusAndElectionGuid(
      fakeDomainElectionTopics[3].electionGuid,
      txn
    );
    expect(result).toStrictEqual({
      electionGuid: fakeDomainElectionTopics[3].electionGuid,
      votes: [
        { voteStatus: 'DELETED', voteCount: '1' },
        { voteStatus: 'INVALID', voteCount: '1' },
        { voteStatus: 'REVERTED', voteCount: '1' },
        { voteStatus: 'VALID', voteCount: '5' }
      ]
    });
  });
});

test('Should return null if voting result by voteStatus for electionGuid does not exists', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.reportByVoteStatusAndElectionGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to report valid voting result by topicGuid for electionGuid', async () => {
  return knexService.transaction(async txn => {
    const result = await voteTopicRepository.reportByValidVoteCountTopicGuidForElectionGuid(
      fakeDomainElectionTopics[3].electionGuid,
      txn
    );
    expect(result).toStrictEqual({
      electionGuid: fakeDomainElectionTopics[3].electionGuid,
      votes: [
        {
          topicGuid: fakeDomainElectionTopics[3].topicGuid,
          topicTitle: `Some title ${fakeDomainElectionTopics[3].topicGuid}`,
          voteCount: '3'
        },
        {
          topicGuid: fakeDomainElectionTopics[2].topicGuid,
          topicTitle: `Some title ${fakeDomainElectionTopics[2].topicGuid}`,
          voteCount: '2'
        }
      ]
    });
  });
});

test('Should return null if voting result by topicGuid for electionGuid does not exists', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteTopicRepository.reportByValidVoteCountTopicGuidForElectionGuid(
      guid,
      txn
    );
    expect(result).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
