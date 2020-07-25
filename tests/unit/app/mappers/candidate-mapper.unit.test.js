'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const CandidateMapper = require('../../../../app/mappers/candidate-mapper.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.candidateMapper = new CandidateMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { candidateMapper } = mapper;

const fakeDomainCandidate = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  displayHeader: 'Some header',
  summary: 'Some summary',
  candidateStatus: 'ACTIVE',
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbCandidate = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  displayHeader: 'Some header',
  summary: 'Some summary',
  candidateStatus: 'ACTIVE',
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(candidateMapper.domainToDb(fakeDomainCandidate)).toStrictEqual(fakeDbCandidate);
});

test('Should be able to map db to Domain', () => {
  expect(candidateMapper.dbToDomain(fakeDbCandidate)).toStrictEqual(fakeDomainCandidate);
});

test('Should be able to map update domain to db', () => {
  expect(
    candidateMapper.updateDomainToDb({
      displayHeader: 'Some header',
      summary: 'Some summary'
    })
  ).toStrictEqual({
    displayHeader: 'Some header',
    summary: 'Some summary',
    updatedAt: now
  });
});