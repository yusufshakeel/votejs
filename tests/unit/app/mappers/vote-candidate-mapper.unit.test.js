'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const VoteCandidateMapper = require('../../../../app/mappers/vote-candidate-mapper.js');

const {
  VOTE_CANDIDATE_VOTE_STATUS_VALID,
  VOTE_CANDIDATE_VOTE_STATUS_REVERTED
} = require('../../../../app/constants/vote-candidate-constants.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.voteCandidateMapper = new VoteCandidateMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { voteCandidateMapper } = mapper;

const fakeDomainVoteCandidate = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voterGuid: '6e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID,
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbVoteCandidate = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  electionGuid: '8e17d7b7-c236-496f-92cd-10e1859fdd3b',
  candidateGuid: '7e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voterGuid: '6e17d7b7-c236-496f-92cd-10e1859fdd3b',
  voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID,
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(voteCandidateMapper.domainToDb(fakeDomainVoteCandidate)).toStrictEqual(
    fakeDbVoteCandidate
  );
});

test('Should be able to map db to Domain', () => {
  expect(voteCandidateMapper.dbToDomain(fakeDbVoteCandidate)).toStrictEqual(
    fakeDomainVoteCandidate
  );
});

test('Should be able to map update domain to db', () => {
  expect(
    voteCandidateMapper.updateDomainToDb({
      voteStatus: VOTE_CANDIDATE_VOTE_STATUS_REVERTED
    })
  ).toStrictEqual({
    voteStatus: VOTE_CANDIDATE_VOTE_STATUS_REVERTED,
    updatedAt: now
  });
});

test('Should be able to map vote result by voteStatus and electionGuid from Db to Domain', () => {
  expect(
    voteCandidateMapper.reportByVoteStatusAndElectionGuidDbToDomain(
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
