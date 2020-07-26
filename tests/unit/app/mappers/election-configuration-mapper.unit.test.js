'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const ElectionConfigurationMapper = require('../../../../app/mappers/election-configuration-mapper.js');
const {
  ELECTION_CONFIGURATION_STATUS_ACTIVE
} = require('../../../../app/constants/election-configuration-constants.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.electionConfigurationMapper = new ElectionConfigurationMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { electionConfigurationMapper } = mapper;

const fakeDomainElectionConfiguration = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbElectionConfiguration = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE,
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(electionConfigurationMapper.domainToDb(fakeDomainElectionConfiguration)).toStrictEqual(
    fakeDbElectionConfiguration
  );
});

test('Should be able to map db to Domain', () => {
  expect(electionConfigurationMapper.dbToDomain(fakeDbElectionConfiguration)).toStrictEqual(
    fakeDomainElectionConfiguration
  );
});

test('Should be able to map update domain to db', () => {
  expect(
    electionConfigurationMapper.updateDomainToDb({
      electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE
    })
  ).toStrictEqual({
    electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE,
    updatedAt: now
  });
});
