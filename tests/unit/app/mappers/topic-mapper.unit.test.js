'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const TopicMapper = require('../../../../app/mappers/topic-mapper.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.topicMapper = new TopicMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { topicMapper } = mapper;

const fakeDomainTopic = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  title: 'title',
  summary: 'summary',
  topicStatus: 'ACTIVE',
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbTopic = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  title: 'title',
  summary: 'summary',
  topicStatus: 'ACTIVE',
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(topicMapper.domainToDb(fakeDomainTopic)).toStrictEqual(fakeDbTopic);
});

test('Should be able to map db to Domain', () => {
  expect(topicMapper.dbToDomain(fakeDbTopic)).toStrictEqual(fakeDomainTopic);
});

test('Should be able to map update domain to db', () => {
  expect(
    topicMapper.updateDomainToDb({
      title: 'Some title update',
      summary: 'Some summary update'
    })
  ).toStrictEqual({
    title: 'Some title update',
    summary: 'Some summary update',
    updatedAt: now
  });
});
