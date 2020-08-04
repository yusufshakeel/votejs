'use strict';

const Services = require('../../../../app/services');
const { update } = require('../../../../app/functional');
const CandidateRepository = require('../../../../app/repositories/candidate-repository.js');
const ElectionRepository = require('../../../../app/repositories/election-repository.js');
const ElectionCandidateRepository = require('../../../../app/repositories/election-candidate-repository.js');
const CandidateMapper = require('../../../../app/mappers/candidate-mapper.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');
const ElectionCandidateMapper = require('../../../../app/mappers/election-candidate-mapper.js');

const {
  ELECTION_CANDIDATE_STATUS_ACTIVE,
  ELECTION_CANDIDATE_STATUS_INACTIVE
} = require('../../../../app/constants/election-candidate-constants.js');

const { ELECTION_STATUS_PUBLIC } = require('../../../../app/constants/election-constants.js');

const { CANDIDATE_STATUS_ACTIVE } = require('../../../../app/constants/candidate-constants.js');

const services = new Services();
const { configService, knexService, uuidService, timeService } = services;

const now = timeService.now();
const DB_QUERY_LIMIT = configService.dbQueryLimit;

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
}

const mappers = new FakeMappers();
const candidateRepository = new CandidateRepository(mappers, configService);
const electionRepository = new ElectionRepository(mappers, configService);
const electionCandidateRepository = new ElectionCandidateRepository(mappers, configService);

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

const getFakeDomainElectionCandidateResponse = (guid, electionGuid, candidateGuid) => ({
  guid,
  electionGuid,
  candidateGuid,
  electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
});

const fakeDomainElections = [
  getFakeDomainElection(),
  getFakeDomainElection(),
  getFakeDomainElection(),
  getFakeDomainElection()
];

const fakeDomainCandidates = [
  getFakeDomainCandidate(),
  getFakeDomainCandidate(),
  getFakeDomainCandidate()
];

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
  }),
  // election candidate #3 -- consists of -- election #2, candidate #1
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[1].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  }),
  // election candidate #4 -- consists of -- election #2, candidate #3
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[1].guid,
    candidateGuid: fakeDomainCandidates[2].guid
  }),
  // election candidate #5 -- consists of -- election #3, candidate #1 -- this is for update test
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[2].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  }),
  // election candidate #6 -- consists of -- election #3, candidate #3 -- this is for upsert test
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[2].guid,
    candidateGuid: fakeDomainCandidates[2].guid
  }),
  // election candidate #7 -- consists of -- election #4, candidate #1 -- for count
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[3].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  }),
  // election candidate #8 -- consists of -- election #4, candidate #2 -- for count
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[3].guid,
    candidateGuid: fakeDomainCandidates[1].guid
  }),
  // election candidate #9 -- consists of -- election #4, candidate #3 -- for count
  getFakeDomainElectionCandidate({
    electionGuid: fakeDomainElections[3].guid,
    candidateGuid: fakeDomainCandidates[2].guid
  })
];

beforeAll(() => {
  return knexService.transaction(async txn => {
    await Promise.all([
      electionRepository.create(fakeDomainElections[0], txn),
      electionRepository.create(fakeDomainElections[1], txn),
      electionRepository.create(fakeDomainElections[2], txn),
      electionRepository.create(fakeDomainElections[3], txn)
    ]);
    await Promise.all([
      candidateRepository.create(fakeDomainCandidates[0], txn),
      candidateRepository.create(fakeDomainCandidates[1], txn),
      candidateRepository.create(fakeDomainCandidates[2], txn)
    ]);

    // for count
    await Promise.all([
      electionCandidateRepository.create(fakeDomainElectionCandidates[6], txn),
      electionCandidateRepository.create(fakeDomainElectionCandidates[7], txn),
      electionCandidateRepository.create(fakeDomainElectionCandidates[8], txn)
    ]);
  });
});

test('Should be able to create new election candidate', async () => {
  return knexService.transaction(async txn => {
    const electionCandidates = await Promise.all([
      electionCandidateRepository.create(fakeDomainElectionCandidates[0], txn),
      electionCandidateRepository.create(fakeDomainElectionCandidates[1], txn),
      electionCandidateRepository.create(fakeDomainElectionCandidates[2], txn),
      electionCandidateRepository.create(fakeDomainElectionCandidates[3], txn)
    ]);
    electionCandidates.forEach((electionCandidate, index) => {
      expect(electionCandidate.electionGuid).toBe(fakeDomainElectionCandidates[index].electionGuid);
      expect(electionCandidate.candidateGuid).toBe(
        fakeDomainElectionCandidates[index].candidateGuid
      );
      expect(fakeDomainElectionCandidates[index]).toStrictEqual(
        getFakeDomainElectionCandidateResponse(
          fakeDomainElectionCandidates[index].guid,
          fakeDomainElectionCandidates[index].electionGuid,
          fakeDomainElectionCandidates[index].candidateGuid
        )
      );
    });
  });
});

test('Should be able to create new election candidate - upsert', async () => {
  return knexService.transaction(async txn => {
    const electionCandidate = await electionCandidateRepository.upsert(
      fakeDomainElectionCandidates[5],
      txn
    );
    expect(electionCandidate).toStrictEqual(
      getFakeDomainElectionCandidateResponse(
        fakeDomainElectionCandidates[5].guid,
        fakeDomainElectionCandidates[5].electionGuid,
        fakeDomainElectionCandidates[5].candidateGuid
      )
    );
  });
});

test('Should be able to update existing election candidate - upsert', async () => {
  return knexService.transaction(async txn => {
    const electionCandidates = await Promise.all([
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[0], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[1], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[2], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[3], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[4], txn)
    ]);
    electionCandidates.forEach((electionCandidate, index) => {
      expect(electionCandidate.electionGuid).toBe(fakeDomainElectionCandidates[index].electionGuid);
      expect(electionCandidate.candidateGuid).toBe(
        fakeDomainElectionCandidates[index].candidateGuid
      );
      expect(fakeDomainElectionCandidates[index]).toStrictEqual(
        getFakeDomainElectionCandidateResponse(
          fakeDomainElectionCandidates[index].guid,
          fakeDomainElectionCandidates[index].electionGuid,
          fakeDomainElectionCandidates[index].candidateGuid
        )
      );
    });
  });
});

test('Should be able to fetch election candidate by guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionCandidateRepository.findByGuid(
      fakeDomainElectionCandidates[0].guid,
      txn
    );
    const expected = update(
      getFakeDomainElectionCandidateResponse(
        fakeDomainElectionCandidates[0].guid,
        fakeDomainElectionCandidates[0].electionGuid,
        fakeDomainElectionCandidates[0].candidateGuid
      ),
      {
        candidateDisplayHeader: { $set: fakeDomainCandidates[0].displayHeader },
        candidateHandle: { $set: fakeDomainCandidates[0].candidateHandle },
        candidateStatus: { $set: fakeDomainCandidates[0].candidateStatus },
        candidateSummary: { $set: fakeDomainCandidates[0].summary }
      }
    );
    expect(result).toStrictEqual(expected);
  });
});

test('Should return null if election candidate is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionCandidateRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election candidate by election guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionCandidateRepository.findByElectionGuid(
      { electionGuid: fakeDomainElections[0].guid },
      txn
    );
    const expected = [
      update(fakeDomainElectionCandidates[0], {
        candidateDisplayHeader: { $set: fakeDomainCandidates[0].displayHeader },
        candidateHandle: { $set: fakeDomainCandidates[0].candidateHandle },
        candidateStatus: { $set: fakeDomainCandidates[0].candidateStatus },
        candidateSummary: { $set: fakeDomainCandidates[0].summary }
      }),
      update(fakeDomainElectionCandidates[1], {
        candidateDisplayHeader: { $set: fakeDomainCandidates[1].displayHeader },
        candidateHandle: { $set: fakeDomainCandidates[1].candidateHandle },
        candidateStatus: { $set: fakeDomainCandidates[1].candidateStatus },
        candidateSummary: { $set: fakeDomainCandidates[1].summary }
      })
    ].sort();
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    expect(result.sort()).toStrictEqual(expected);
  });
});

test('Should return null if election candidate is not found - findByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionCandidateRepository.findByElectionGuid(
      { electionGuid: guid },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election candidate by candidate guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionCandidateRepository.findByCandidateGuid(
      { candidateGuid: fakeDomainCandidates[0].guid },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    result.forEach(electionCandidate => {
      expect(electionCandidate.candidateGuid).toBe(fakeDomainCandidates[0].guid);
    });
  });
});

test('Should return null if election candidate is not found - findByCandidateGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionCandidateRepository.findByCandidateGuid(
      { candidateGuid: guid },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election candidate by findByElectionCandidateStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await electionCandidateRepository.findByElectionCandidateStatus(
      { electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    result.forEach(electionCandidate => {
      expect(electionCandidate.electionCandidateStatus).toBe(ELECTION_CANDIDATE_STATUS_ACTIVE);
    });
  });
});

test('Should return null if election candidate is not found - findByElectionCandidateStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await electionCandidateRepository.findByElectionCandidateStatus(
      { electionCandidateStatus: 'hahaha' },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to update election candidate', async () => {
  return knexService.transaction(async txn => {
    await electionCandidateRepository.upsert(fakeDomainElectionCandidates[4], txn);
    const dataToUpdate = {
      electionCandidateStatus: ELECTION_CANDIDATE_STATUS_INACTIVE
    };
    const result = await electionCandidateRepository.updateByGuid(
      fakeDomainElectionCandidates[4].guid,
      dataToUpdate,
      txn
    );
    expect(result).toStrictEqual({
      ...fakeDomainElectionCandidates[4],
      ...dataToUpdate,
      audit: {
        createdAt: now,
        updatedAt: now
      }
    });
  });
});

test('Should return null when updating election candidate that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      electionCandidateStatus: ELECTION_CANDIDATE_STATUS_ACTIVE
    };
    const result = await electionCandidateRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to find all election candidate without passing any params', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[0], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[1], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[2], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[3], txn),
      electionCandidateRepository.upsert(fakeDomainElectionCandidates[4], txn)
    ]);
    const fetchedElectionCandidates = await electionCandidateRepository.findAll({}, txn);
    expect(fetchedElectionCandidates.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
  });
});

test('Should return null if election candidate is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedElectionCandidates = await electionCandidateRepository.findAll(
      {
        whereClause: { electionCandidateStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedElectionCandidates).toBeNull();
  });
});

test('Should be able to count candidates by electionGuid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionCandidateRepository.countByElectionGuid(
      fakeDomainElections[3].guid,
      txn
    );
    expect(result).toStrictEqual({
      electionGuid: fakeDomainElections[3].guid,
      candidateCount: '3'
    });
  });
});

test('Should return 0 as candidateCount if election candidate is not found = countByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionCandidateRepository.countByElectionGuid(guid, txn);
    expect(result).toStrictEqual({
      electionGuid: guid,
      candidateCount: '0'
    });
  });
});

afterAll(() => {
  return knexService.destroy();
});
