'use strict';

const Services = require('../../../../app/services');
const CandidateRepository = require('../../../../app/repositories/candidate-repository.js');
const ElectionRepository = require('../../../../app/repositories/election-repository.js');
const ElectionConfigurationRepository = require('../../../../app/repositories/election-configuration-repository.js');
const CandidateMapper = require('../../../../app/mappers/candidate-mapper.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');
const ElectionConfigurationMapper = require('../../../../app/mappers/election-configuration-mapper.js');

const {
  ELECTION_CONFIGURATION_STATUS_ACTIVE,
  ELECTION_CONFIGURATION_STATUS_INACTIVE
} = require('../../../../app/constants/election-configuration-constants.js');

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
  this.electionConfigurationMapper = new ElectionConfigurationMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const candidateRepository = new CandidateRepository(mappers, configService);
const electionRepository = new ElectionRepository(mappers, configService);
const electionConfigurationRepository = new ElectionConfigurationRepository(mappers, configService);

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

const getFakeDomainElectionConfiguration = ({
  guid = uuidService.uuid(),
  electionGuid,
  candidateGuid
}) => ({
  guid,
  electionGuid,
  candidateGuid,
  electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
});

const getFakeDomainElectionConfigurationResponse = (guid, electionGuid, candidateGuid) => ({
  guid,
  electionGuid,
  candidateGuid,
  electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE,
  audit: {
    createdAt: now,
    updatedAt: now
  }
});

const fakeDomainElections = [
  getFakeDomainElection(),
  getFakeDomainElection(),
  getFakeDomainElection()
];

const fakeDomainCandidates = [
  getFakeDomainCandidate(),
  getFakeDomainCandidate(),
  getFakeDomainCandidate()
];

const fakeDomainElectionConfigurations = [
  // election config #1 -- consists of -- election #1, candidate #1
  getFakeDomainElectionConfiguration({
    electionGuid: fakeDomainElections[0].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  }),
  // election config #2 -- consists of -- election #1, candidate #2
  getFakeDomainElectionConfiguration({
    electionGuid: fakeDomainElections[0].guid,
    candidateGuid: fakeDomainCandidates[1].guid
  }),
  // election config #3 -- consists of -- election #2, candidate #1
  getFakeDomainElectionConfiguration({
    electionGuid: fakeDomainElections[1].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  }),
  // election config #4 -- consists of -- election #2, candidate #3
  getFakeDomainElectionConfiguration({
    electionGuid: fakeDomainElections[1].guid,
    candidateGuid: fakeDomainCandidates[2].guid
  }),
  // election config #5 -- consists of -- election #3, candidate #1 -- this is for update test
  getFakeDomainElectionConfiguration({
    electionGuid: fakeDomainElections[2].guid,
    candidateGuid: fakeDomainCandidates[0].guid
  })
];

beforeAll(() => {
  return knexService.transaction(async txn => {
    await Promise.all([
      electionRepository.create(fakeDomainElections[0], txn),
      electionRepository.create(fakeDomainElections[1], txn),
      electionRepository.create(fakeDomainElections[2], txn)
    ]);
    await Promise.all([
      candidateRepository.create(fakeDomainCandidates[0], txn),
      candidateRepository.create(fakeDomainCandidates[1], txn),
      candidateRepository.create(fakeDomainCandidates[2], txn)
    ]);
  });
});

test('Should be able to create new election configuration', async () => {
  return knexService.transaction(async txn => {
    const electionConfigurations = await Promise.all([
      electionConfigurationRepository.create(fakeDomainElectionConfigurations[0], txn),
      electionConfigurationRepository.create(fakeDomainElectionConfigurations[1], txn),
      electionConfigurationRepository.create(fakeDomainElectionConfigurations[2], txn),
      electionConfigurationRepository.create(fakeDomainElectionConfigurations[3], txn)
    ]);
    electionConfigurations.forEach((electionConfiguration, index) => {
      expect(electionConfiguration.electionGuid).toBe(
        fakeDomainElectionConfigurations[index].electionGuid
      );
      expect(electionConfiguration.candidateGuid).toBe(
        fakeDomainElectionConfigurations[index].candidateGuid
      );
      expect(fakeDomainElectionConfigurations[index]).toStrictEqual(
        getFakeDomainElectionConfigurationResponse(
          fakeDomainElectionConfigurations[index].guid,
          fakeDomainElectionConfigurations[index].electionGuid,
          fakeDomainElectionConfigurations[index].candidateGuid
        )
      );
    });
  });
});

test('Should be able to update existing election configuration - upsert', async () => {
  return knexService.transaction(async txn => {
    const electionConfigurations = await Promise.all([
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[0], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[1], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[2], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[3], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[4], txn)
    ]);
    electionConfigurations.forEach((electionConfiguration, index) => {
      expect(electionConfiguration.electionGuid).toBe(
        fakeDomainElectionConfigurations[index].electionGuid
      );
      expect(electionConfiguration.candidateGuid).toBe(
        fakeDomainElectionConfigurations[index].candidateGuid
      );
      expect(fakeDomainElectionConfigurations[index]).toStrictEqual(
        getFakeDomainElectionConfigurationResponse(
          fakeDomainElectionConfigurations[index].guid,
          fakeDomainElectionConfigurations[index].electionGuid,
          fakeDomainElectionConfigurations[index].candidateGuid
        )
      );
    });
  });
});

test('Should be able to fetch election configuration by guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionConfigurationRepository.findByGuid(
      fakeDomainElectionConfigurations[0].guid,
      txn
    );
    expect(result).toStrictEqual(
      getFakeDomainElectionConfigurationResponse(
        fakeDomainElectionConfigurations[0].guid,
        fakeDomainElectionConfigurations[0].electionGuid,
        fakeDomainElectionConfigurations[0].candidateGuid
      )
    );
  });
});

test('Should return null if election configuration is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionConfigurationRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election configuration by election guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionConfigurationRepository.findByElectionGuid(
      { electionGuid: fakeDomainElections[0].guid },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    expect(result.sort()).toStrictEqual(
      [fakeDomainElectionConfigurations[0], fakeDomainElectionConfigurations[1]].sort()
    );
  });
});

test('Should return null if election configuration is not found - findByElectionGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionConfigurationRepository.findByElectionGuid(
      { electionGuid: guid },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election configuration by candidate guid', async () => {
  return knexService.transaction(async txn => {
    const result = await electionConfigurationRepository.findByCandidateGuid(
      { candidateGuid: fakeDomainCandidates[0].guid },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    result.forEach(electionConfiguration => {
      expect(electionConfiguration.candidateGuid).toBe(fakeDomainCandidates[0].guid);
    });
  });
});

test('Should return null if election configuration is not found - findByCandidateGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionConfigurationRepository.findByElectionGuid(
      { electionGuid: guid },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election configuration by election configuration status', async () => {
  return knexService.transaction(async txn => {
    const result = await electionConfigurationRepository.findByElectionConfigurationStatus(
      { electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE },
      txn
    );
    expect(result.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    result.forEach(electionConfiguration => {
      expect(electionConfiguration.electionConfigurationStatus).toBe(
        ELECTION_CONFIGURATION_STATUS_ACTIVE
      );
    });
  });
});

test('Should return null if election configuration is not found - findByElectionConfigurationStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await electionConfigurationRepository.findByElectionConfigurationStatus(
      { electionConfigurationStatus: 'hahaha' },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to update election configuration', async () => {
  return knexService.transaction(async txn => {
    await electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[4], txn);
    const dataToUpdate = {
      electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_INACTIVE
    };
    const result = await electionConfigurationRepository.updateByGuid(
      fakeDomainElectionConfigurations[4].guid,
      dataToUpdate,
      txn
    );
    expect(result).toStrictEqual({
      ...fakeDomainElectionConfigurations[4],
      ...dataToUpdate,
      audit: {
        createdAt: now,
        updatedAt: now
      }
    });
  });
});

test('Should return null when updating election configuration that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      electionConfigurationStatus: ELECTION_CONFIGURATION_STATUS_ACTIVE
    };
    const result = await electionConfigurationRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to find all election configurations without passing any params', async () => {
  return knexService.transaction(async txn => {
    await Promise.all([
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[0], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[1], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[2], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[3], txn),
      electionConfigurationRepository.upsert(fakeDomainElectionConfigurations[4], txn)
    ]);
    const fetchedElectionConfigurations = await electionConfigurationRepository.findAll({}, txn);
    expect(fetchedElectionConfigurations.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
  });
});

test('Should return null if election configuration is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedElectionConfigurations = await electionConfigurationRepository.findAll(
      {
        whereClause: { electionConfigurationStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedElectionConfigurations).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
