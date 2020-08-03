'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const ElectionTopicMapper = require('../../../../app/mappers/election-topic-mapper.js');
const {
  ELECTION_TOPIC_STATUS_ACTIVE
} = require('../../../../app/constants/election-topic-constants.js');
const { TOPIC_STATUS_ACTIVE } = require('../../../../app/constants/topic-constants.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.electionTopicMapper = new ElectionTopicMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { electionTopicMapper } = mapper;

const fakeApiElectionTopic = {
  electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE
};

const fakeDomainElectionTopic = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE,
  topicTitle: 'Some title',
  topicSummary: 'Some summary',
  topicStatus: TOPIC_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbElectionTopic = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE,
  topicTitle: 'Some title',
  topicSummary: 'Some summary',
  topicStatus: TOPIC_STATUS_ACTIVE,
  createdAt: now,
  updatedAt: now
};

test('Should be able to map api to domain', () => {
  expect(electionTopicMapper.apiToDomain(fakeApiElectionTopic)).toStrictEqual({
    electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE
  });
});

test('Should be able to map domain to api', () => {
  expect(electionTopicMapper.domainToApi(fakeDomainElectionTopic)).toStrictEqual({
    guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE,
    topicTitle: 'Some title',
    topicSummary: 'Some summary',
    topicStatus: TOPIC_STATUS_ACTIVE,
    audit: {
      createdAt: now,
      updatedAt: now
    }
  });
});

test('Should be able to map domain to db', () => {
  expect(electionTopicMapper.domainToDb(fakeDomainElectionTopic)).toStrictEqual(
    fakeDbElectionTopic
  );
});

test('Should be able to map db to Domain', () => {
  expect(electionTopicMapper.dbToDomain(fakeDbElectionTopic)).toStrictEqual(
    fakeDomainElectionTopic
  );
});

test('Should be able to map update domain to db', () => {
  expect(
    electionTopicMapper.updateDomainToDb({
      electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE
    })
  ).toStrictEqual({
    electionTopicStatus: ELECTION_TOPIC_STATUS_ACTIVE,
    updatedAt: now
  });
});

test('Should be able to map topic count by electionGuid', () => {
  expect(
    electionTopicMapper.countByElectionGuidDbToDomain('94723cd2-994b-413e-87fe-448cb747e101', 10)
  ).toStrictEqual({
    electionGuid: '94723cd2-994b-413e-87fe-448cb747e101',
    topicCount: 10
  });
});
