'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const ElectionCandidateMapper = require('../../../../app/mappers/election-candidate-mapper.js');
const {
  ELECTION_CANDIDATE_STATUS_ACTIVE
} = require('../../../../app/constants/election-candidate-constants.js');
const { CANDIDATE_STATUS_ACTIVE } = require('../../../../app/constants/candidate-constants.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.electionCandidateMapper = new ElectionCandidateMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { electionCandidateMapper } = mapper;

const fakeApiElectionCandidate = {
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE
};

const fakeDomainElectionCandidate = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE,
  candidateDisplayHeader: 'candidateDisplayHeader',
  candidateHandle: 'candidateHandle',
  candidateSummary: 'candidateSummary',
  candidateStatus: CANDIDATE_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbElectionCandidate = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE,
  candidateDisplayHeader: 'candidateDisplayHeader',
  candidateHandle: 'candidateHandle',
  candidateSummary: 'candidateSummary',
  candidateStatus: CANDIDATE_STATUS_ACTIVE,
  createdAt: now,
  updatedAt: now
};

test('Should be able to map api to domain', () => {
  expect(electionCandidateMapper.apiToDomain(fakeApiElectionCandidate)).toStrictEqual({
    electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
    candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
    electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE
  });
});

test('Should be able to map domain to api', () => {
  expect(electionCandidateMapper.domainToApi(fakeDomainElectionCandidate)).toStrictEqual({
    guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
    candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
    electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE,
    candidateDisplayHeader: 'candidateDisplayHeader',
    candidateHandle: 'candidateHandle',
    candidateSummary: 'candidateSummary',
    candidateStatus: CANDIDATE_STATUS_ACTIVE,
    audit: {
      createdAt: now,
      updatedAt: now
    }
  });
});

test('Should be able to map domain to db', () => {
  expect(electionCandidateMapper.domainToDb(fakeDomainElectionCandidate)).toStrictEqual(
    fakeDbElectionCandidate
  );
});

test('Should be able to map db to Domain', () => {
  expect(electionCandidateMapper.dbToDomain(fakeDbElectionCandidate)).toStrictEqual(
    fakeDomainElectionCandidate
  );
});

test('Should be able to map update domain to db', () => {
  expect(
    electionCandidateMapper.updateDomainToDb({
      electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE
    })
  ).toStrictEqual({
    electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE,
    updatedAt: now
  });
});

test('Should be able to map candidate count by electionGuid', () => {
  expect(
    electionCandidateMapper.countByElectionGuidDbToDomain(
      '94723cd2-994b-413e-87fe-448cb747e101',
      10
    )
  ).toStrictEqual({
    electionGuid: '94723cd2-994b-413e-87fe-448cb747e101',
    candidateCount: 10
  });
});
