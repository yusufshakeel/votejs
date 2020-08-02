'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const VoteTopicMapper = require('../../../../app/mappers/vote-topic-mapper.js');

const {
  VOTE_TOPIC_VOTE_STATUS_VALID,
  VOTE_TOPIC_VOTE_STATUS_REVERTED
} = require('../../../../app/constants/vote-topic-constants.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.voteTopicMapper = new VoteTopicMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { voteTopicMapper } = mapper;

const fakeDomainVoteTopic = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  topicGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voterGuid: '6e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID,
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbVoteTopic = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  topicGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voterGuid: '6e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voteStatus: VOTE_TOPIC_VOTE_STATUS_VALID,
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(voteTopicMapper.domainToDb(fakeDomainVoteTopic)).toStrictEqual(fakeDbVoteTopic);
});

test('Should be able to map db to Domain', () => {
  expect(voteTopicMapper.dbToDomain(fakeDbVoteTopic)).toStrictEqual(fakeDomainVoteTopic);
});

test('Should be able to map update domain to db', () => {
  expect(
    voteTopicMapper.updateDomainToDb({
      voteStatus: VOTE_TOPIC_VOTE_STATUS_REVERTED
    })
  ).toStrictEqual({
    voteStatus: VOTE_TOPIC_VOTE_STATUS_REVERTED,
    updatedAt: now
  });
});

test('Should be able to map vote result by voteStatus and electionGuid from Db to Domain', () => {
  expect(
    voteTopicMapper.reportByVoteStatusAndElectionGuidDbToDomain(
      'c7c0f661-58a0-4809-af6b-901b43231443',
      [
        { voteStatus: 'DELETED', voteCount: '1' },
        { voteStatus: 'INVALID', voteCount: '1' },
        { voteStatus: 'REVERTED', voteCount: '1' },
        { voteStatus: 'VALID', voteCount: '8' }
      ]
    )
  ).toStrictEqual({
    electionGuid: 'c7c0f661-58a0-4809-af6b-901b43231443',
    votes: [
      { voteStatus: 'DELETED', voteCount: '1' },
      { voteStatus: 'INVALID', voteCount: '1' },
      { voteStatus: 'REVERTED', voteCount: '1' },
      { voteStatus: 'VALID', voteCount: '8' }
    ]
  });
});

test('Should be able to map valid vote result by topicGuid for electionGuid from Db to Domain', () => {
  expect(
    voteTopicMapper.reportByValidVoteCountTopicGuidForElectionGuidDbToDomain(
      'f38cf29e-d393-4d1c-8c40-2c8544fc5eed',
      [
        {
          topicGuid: '316d778d-e24b-4bc3-9c69-d18543a164bb',
          voteCount: '2'
        },
        {
          topicGuid: '44c1455d-6deb-4cba-bae5-816afe0aa16a',
          voteCount: '3'
        }
      ],
      [
        {
          guid: 'f170c2ba-b5b7-4068-b06d-9be928055880',
          electionGuid: 'f38cf29e-d393-4d1c-8c40-2c8544fc5eed',
          topicGuid: '316d778d-e24b-4bc3-9c69-d18543a164bb',
          electionTopicStatus: 'ACTIVE',
          candidateDisplayHeader: 'Candidate display header 316d778d-e24b-4bc3-9c69-d18543a164bb',
          topicTitle: 'Topic title 316d778d-e24b-4bc3-9c69-d18543a164bb',
          topicSummary: 'Topic summary 316d778d-e24b-4bc3-9c69-d18543a164bb',
          topicStatus: 'ACTIVE',
          audit: {
            createdAt: now,
            updatedAt: now
          }
        },
        {
          guid: '3dfa9e53-481a-4e1a-8c87-11e65735e8be',
          electionGuid: 'f38cf29e-d393-4d1c-8c40-2c8544fc5eed',
          topicGuid: '44c1455d-6deb-4cba-bae5-816afe0aa16a',
          electionTopicStatus: 'ACTIVE',
          topicTitle: 'Topic title 44c1455d-6deb-4cba-bae5-816afe0aa16a',
          topicSummary: 'Topic summary 44c1455d-6deb-4cba-bae5-816afe0aa16a',
          topicStatus: 'ACTIVE',
          audit: {
            createdAt: now,
            updatedAt: now
          }
        }
      ]
    )
  ).toStrictEqual({
    electionGuid: 'f38cf29e-d393-4d1c-8c40-2c8544fc5eed',
    votes: [
      {
        topicGuid: '316d778d-e24b-4bc3-9c69-d18543a164bb',
        topicTitle: 'Topic title 316d778d-e24b-4bc3-9c69-d18543a164bb',
        voteCount: '2'
      },
      {
        topicGuid: '44c1455d-6deb-4cba-bae5-816afe0aa16a',
        topicTitle: 'Topic title 44c1455d-6deb-4cba-bae5-816afe0aa16a',
        voteCount: '3'
      }
    ]
  });
});
