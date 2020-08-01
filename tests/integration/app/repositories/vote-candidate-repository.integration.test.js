'use strict';

const Services = require('../../../../app/services');
const CandidateRepository = require('../../../../app/repositories/candidate-repository.js');
const ElectionRepository = require('../../../../app/repositories/election-repository.js');
const ElectionCandidateRepository = require('../../../../app/repositories/election-candidate-repository.js');
const VoterRepository = require('../../../../app/repositories/voter-repository.js');
const VoteCandidateRepository = require('../../../../app/repositories/vote-candidate-repository.js');
const CandidateMapper = require('../../../../app/mappers/candidate-mapper.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');
const ElectionCandidateMapper = require('../../../../app/mappers/election-candidate-mapper.js');
const VoterMapper = require('../../../../app/mappers/voter-mapper.js');
const VoteCandidateMapper = require('../../../../app/mappers/vote-candidate-mapper.js');

const { VOTER_ACCOUNT_STATUS_ACTIVE } = require('../../../../app/constants/voter-constants.js');

const {
  ELECTION_CANDIDATE_STATUS_ACTIVE
} = require('../../../../app/constants/election-candidate-constants.js');

const { ELECTION_STATUS_PUBLIC } = require('../../../../app/constants/election-constants.js');

const { CANDIDATE_STATUS_ACTIVE } = require('../../../../app/constants/candidate-constants.js');

const {
  VOTE_CANDIDATE_VOTE_STATUS_VALID,
  VOTE_CANDIDATE_VOTE_STATUS_INVALID,
  VOTE_CANDIDATE_VOTE_STATUS_REVERTED,
  VOTE_CANDIDATE_VOTE_STATUS_DELETED
} = require('../../../../app/constants/vote-candidate-constants.js');

const services = new Services();
const { configService, knexService, uuidService, timeService } = services;

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.candidateMapper = new CandidateMapper(this.auditMapper);
  this.electionMapper = new ElectionMapper(this.auditMapper);
  this.electionCandidateMapper = new ElectionCandidateMapper(this.auditMapper);
  this.voterMapper = new VoterMapper(this.auditMapper);
  this.voteCandidateMapper = new VoteCandidateMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const candidateRepository = new CandidateRepository(mappers, configService);
const electionRepository = new ElectionRepository(mappers, configService);
const electionCandidateRepository = new ElectionCandidateRepository(mappers, configService);
const voterRepository = new VoterRepository(mappers, configService);
const voteCandidateRepository = new VoteCandidateRepository(mappers, configService);

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

const getFakeDomainCandidate = (guid = uuidService.uuid()) => ({
  guid,
  candidateHandle: `Candidate Handle ${guid}`,
  displayHeader: `Candidate display header ${guid}`,
  summary: `Candidate summary ${guid}`,
  candidateStatus: CANDIDATE_STATUS_ACTIVE,
  audit: {
    createdAt: now
  }
});

const getFakeDomainElectionCandidate = ({
  guid = uuidService.uuid(),
  electionGuid,
  candidateGuid
}) => ({
  guid,
  electionGuid,
  candidateGuid,
  electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE,
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
  })
];

const fakeDomainElections = [getFakeDomainElection()];

const fakeDomainCandidates = [getFakeDomainCandidate(), getFakeDomainCandidate()];

const fakeDomainElectionCandidates = [
  // election candidate #1 -- consists of -- election #1, candidate #1
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[0].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  }),
  // election candidate #2 -- consists of -- election #1, candidate #2
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[0].guid,
    candidateGuid: fakeDomainCandidates[1].guid
  })
];

beforeAll(() => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voterRepository.create(fakeDomainVoters[0], txn),
      voterRepository.create(fakeDomainVoters[1], txn)
    ]);
    await Promise.all([
      electionRepository.create(fakeDomainElections[0], txn),
      electionRepository.create(fakeDomainElections[1], txn)
    ]);
    await Promise.all([
      candidateRepository.create(fakeDomainCandidates[0], txn),
      candidateRepository.create(fakeDomainCandidates[1], txn)
    ]);
    await Promise.all([
      electionCandidateRepository.create(fakeDomainElectionCandidates[0], txn),
      electionCandidateRepository.create(fakeDomainElectionCandidates[1], txn)
    ]);
  });
});

const getFakeVoteCandidate = ({
  guid = uuidService.uuid(),
  electionGuid,
  candidateGuid,
  voterGuid
}) => ({
  guid,
  electionGuid,
  candidateGuid,
  voterGuid,
  voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID,
  audit: {
    createdAt: now
  }
});

const getFakeVoteCandidateResponse = ({ guid, electionGuid, candidateGuid, voterGuid }) => ({
  guid,
  electionGuid,
  candidateGuid,
  voterGuid,
  voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID,
  audit: {
    createdAt: now
  }
});

test('Should be able to create new vote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const domainVoteCandidate = getFakeVoteCandidate({
      guid,
      electionGuid: fakeDomainElectionCandidates[0].electionGuid,
      candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
      voterGuid: fakeDomainVoters[0].guid,
      voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
    });
    const result = await voteCandidateRepository.create(domainVoteCandidate, txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch vote candidate by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const domainVoteCandidate = getFakeVoteCandidate({
      guid,
      electionGuid: fakeDomainElectionCandidates[0].electionGuid,
      candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
      voterGuid: fakeDomainVoters[0].guid,
      voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
    });
    await voteCandidateRepository.create(domainVoteCandidate, txn);
    const result = await voteCandidateRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(
      getFakeVoteCandidateResponse({
        guid,
        electionGuid: fakeDomainElectionCandidates[0].electionGuid,
        candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
        voterGuid: fakeDomainVoters[0].guid
      })
    );
  });
});

test('Should return null if vote candidate is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteCandidateRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote candidate by voteStatus', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteCandidateRepository.create(
        getFakeVoteCandidate({
          electionGuid: fakeDomainElectionCandidates[0].electionGuid,
          candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteCandidate = await voteCandidateRepository.findByVoteStatus(
      { voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteCandidate.length).toBe(3);
    fetchedVoteCandidate.forEach(voteCandidate => {
      expect(voteCandidate.voteStatus).toBe(VOTE_CANDIDATE_VOTE_STATUS_VALID);
    });
  });
});

test('Should return null if vote candidate is not found - findByVoteStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await voteCandidateRepository.findByVoteStatus({ voteStatus: 'hahaha' }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote candidate by electionGuid', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteCandidateRepository.create(
        getFakeVoteCandidate({
          electionGuid: fakeDomainElectionCandidates[0].electionGuid,
          candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteCandidate = await voteCandidateRepository.findByElectionGuid(
      { electionGuid: fakeDomainElectionCandidates[0].electionGuid, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteCandidate.length).toBeLessThanOrEqual(3);
    fetchedVoteCandidate.forEach(voteCandidate => {
      expect(voteCandidate.electionGuid).toBe(fakeDomainElectionCandidates[0].electionGuid);
    });
  });
});

test('Should return null if vote candidate is not found - findByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const electionGuid = uuidService.uuid();
    const result = await voteCandidateRepository.findByElectionGuid({ electionGuid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote candidate by voterGuid', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteCandidateRepository.create(
        getFakeVoteCandidate({
          electionGuid: fakeDomainElectionCandidates[0].electionGuid,
          candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteCandidate = await voteCandidateRepository.findByVoterGuid(
      { voterGuid: fakeDomainVoters[0].guid, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteCandidate.length).toBeLessThanOrEqual(3);
    fetchedVoteCandidate.forEach(voteCandidate => {
      expect(voteCandidate.voterGuid).toBe(fakeDomainVoters[0].guid);
    });
  });
});

test('Should return null if vote candidate is not found - findByVoterGuid', async () => {
  return knexService.transaction(async txn => {
    const voterGuid = uuidService.uuid();
    const result = await voteCandidateRepository.findByVoterGuid({ voterGuid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch vote candidate by candidateGuid', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      voteCandidateRepository.create(
        getFakeVoteCandidate({
          electionGuid: fakeDomainElectionCandidates[0].electionGuid,
          candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
          voterGuid: fakeDomainVoters[0].guid,
          voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
        }),
        txn
      )
    ]);
    const fetchedVoteCandidate = await voteCandidateRepository.findByCandidateGuid(
      { candidateGuid: fakeDomainElectionCandidates[0].candidateGuid, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoteCandidate.length).toBeLessThanOrEqual(3);
    fetchedVoteCandidate.forEach(voteCandidate => {
      expect(voteCandidate.candidateGuid).toBe(fakeDomainElectionCandidates[0].candidateGuid);
    });
  });
});

test('Should return null if vote candidate is not found - findByCandidateGuid', async () => {
  return knexService.transaction(async txn => {
    const candidateGuid = uuidService.uuid();
    const result = await voteCandidateRepository.findByCandidateGuid({ candidateGuid }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote invalid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteCandidateRepository.create(
      getFakeVoteCandidate({
        guid,
        electionGuid: fakeDomainElectionCandidates[0].electionGuid,
        candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
      }),
      txn
    );
    const result = await voteCandidateRepository.invalidVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_CANDIDATE_VOTE_STATUS_INVALID);
  });
});

test('Should return null if vote candidate is not found - invalidVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteCandidateRepository.invalidVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote valid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteCandidateRepository.create(
      getFakeVoteCandidate({
        guid,
        electionGuid: fakeDomainElectionCandidates[0].electionGuid,
        candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_CANDIDATE_VOTE_STATUS_INVALID
      }),
      txn
    );
    const result = await voteCandidateRepository.validVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_CANDIDATE_VOTE_STATUS_VALID);
  });
});

test('Should return null if vote candidate is not found - validVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteCandidateRepository.validVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote reverted', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteCandidateRepository.create(
      getFakeVoteCandidate({
        guid,
        electionGuid: fakeDomainElectionCandidates[0].electionGuid,
        candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
      }),
      txn
    );
    const result = await voteCandidateRepository.revertVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_CANDIDATE_VOTE_STATUS_REVERTED);
  });
});

test('Should return null if vote candidate is not found - revertVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteCandidateRepository.revertVote(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to make vote deleted', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voteCandidateRepository.create(
      getFakeVoteCandidate({
        guid,
        electionGuid: fakeDomainElectionCandidates[0].electionGuid,
        candidateGuid: fakeDomainElectionCandidates[0].candidateGuid,
        voterGuid: fakeDomainVoters[0].guid,
        voteStatus: VOTE_CANDIDATE_VOTE_STATUS_VALID
      }),
      txn
    );
    const result = await voteCandidateRepository.deleteVote(guid, txn);
    expect(result.guid).toBe(guid);
    expect(result.voteStatus).toBe(VOTE_CANDIDATE_VOTE_STATUS_DELETED);
  });
});

test('Should return null if vote candidate is not found - deleteVote', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voteCandidateRepository.deleteVote(guid, txn);
    expect(result).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
