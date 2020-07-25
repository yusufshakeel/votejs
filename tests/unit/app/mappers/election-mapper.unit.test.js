'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.electionMapper = new ElectionMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { electionMapper } = mapper;

const fakeDomainElection = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  title: 'title',
  summary: 'summary',
  startsAt: now,
  endsAt: now,
  electionStatus: 'DRAFT',
  electionSettings: {
    field: 'value'
  },
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbElection = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  title: 'title',
  summary: 'summary',
  startsAt: now,
  endsAt: now,
  electionStatus: 'DRAFT',
  electionSettings: {
    field: 'value'
  },
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(electionMapper.domainToDb(fakeDomainElection)).toStrictEqual(fakeDbElection);
});

test('Should be able to map db to Domain', () => {
  expect(electionMapper.dbToDomain(fakeDbElection)).toStrictEqual(fakeDomainElection);
});

test('Should be able to map update domain to db', () => {
  expect(
    electionMapper.updateDomainToDb({
      electionStatus: 'PUBLIC',
      electionSettings: {
        field: 'value',
        field2: 'value2'
      }
    })
  ).toStrictEqual({
    electionStatus: 'PUBLIC',
    electionSettings: {
      field: 'value',
      field2: 'value2'
    },
    updatedAt: now
  });
});
