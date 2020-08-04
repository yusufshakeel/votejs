'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');
const ElectionRepository = require('../../../../app/repositories/election-repository.js');
const ElectionMapper = require('../../../../app/mappers/election-mapper.js');
const {
  ELECTION_STATUS_DRAFT,
  ELECTION_STATUS_PUBLIC,
  ELECTION_VOTE_ON_CANDIDATE
} = require('../../../../app/constants/election-constants.js');

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
  this.electionMapper = new ElectionMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const electionRepository = new ElectionRepository(mappers, configService);

const getFakeDomainElection = (guid = uuidService.uuid()) => ({
  guid,
  title: 'Some title',
  summary: 'Some summary',
  startsAt: now,
  endsAt: now,
  voteOn: ELECTION_VOTE_ON_CANDIDATE,
  electionStatus: ELECTION_STATUS_DRAFT,
  electionSettings: {
    field: 'value'
  },
  audit: {
    createdAt: now
  }
});

const getFakeDomainElectionResponse = guid => ({
  guid,
  title: 'Some title',
  summary: 'Some summary',
  startsAt: now,
  endsAt: now,
  voteOn: ELECTION_VOTE_ON_CANDIDATE,
  electionStatus: ELECTION_STATUS_DRAFT,
  electionSettings: {
    field: 'value'
  },
  audit: {
    createdAt: now
  }
});

test('Should be able to create new election', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionRepository.create(getFakeDomainElection(guid), txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch election by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await electionRepository.create(getFakeDomainElection(guid), txn);
    const result = await electionRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(getFakeDomainElectionResponse(guid));
  });
});

test('Should return null if election is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await electionRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch election by findByElectionStatus', async () => {
  return knexService.transaction(async txn => {
    const getFakeElection = () => getFakeDomainElection(uuidService.uuid());
    await Promise.all([
      electionRepository.create(getFakeElection(), txn),
      electionRepository.create(getFakeElection(), txn),
      electionRepository.create(getFakeElection(), txn)
    ]);
    const fetchedElections = await electionRepository.findByElectionStatus(
      { electionStatus: ELECTION_STATUS_DRAFT, limit: 3, page: 1 },
      txn
    );
    expect(fetchedElections.length).toBe(3);
    fetchedElections.forEach(election => {
      expect(election.electionStatus).toBe(ELECTION_STATUS_DRAFT);
    });
  });
});

test('Should return null if election is not found - findByElectionStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await electionRepository.findByElectionStatus({ electionStatus: 'hahaha' }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to update election', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainElection = getFakeDomainElection(guid);
    await electionRepository.create(fakeDomainElection, txn);
    const dataToUpdate = {
      electionStatus: ELECTION_STATUS_PUBLIC,
      electionSettings: {
        field: 'value',
        field2: 'value2'
      }
    };
    const result = await electionRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toStrictEqual({
      ...getFakeDomainElectionResponse(guid),
      ...dataToUpdate,
      audit: {
        createdAt: now,
        updatedAt: now
      }
    });
  });
});

test('Should return null when updating election that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      electionStatus: ELECTION_STATUS_PUBLIC,
      electionSettings: {
        field: 'value',
        field2: 'value2'
      }
    };
    const result = await electionRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to find all elections without passing any params', async () => {
  return knexService.transaction(async txn => {
    const getFakeElection = () => getFakeDomainElection(uuidService.uuid());
    await Promise.all([
      electionRepository.create(getFakeElection(), txn),
      electionRepository.create(getFakeElection(), txn),
      electionRepository.create(getFakeElection(), txn)
    ]);
    const fetchedElections = await electionRepository.findAll({}, txn);
    expect(fetchedElections.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedElections.forEach(election => {
      const allFields = keys(getFakeDomainElectionResponse());
      const isReturnedFieldsCorrect = keys(election).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should be able to find all elections - with whereClause', async () => {
  return knexService.transaction(async txn => {
    const getFakeElection = () => ({
      ...getFakeDomainElection(uuidService.uuid()),
      electionStatus: ELECTION_STATUS_PUBLIC
    });
    await Promise.all([
      electionRepository.create(getFakeElection(), txn),
      electionRepository.create(getFakeElection(), txn),
      electionRepository.create(getFakeElection(), txn)
    ]);
    const fetchedElections = await electionRepository.findAll(
      { whereClause: { electionStatus: ELECTION_STATUS_PUBLIC }, limit: 3, page: 1 },
      txn
    );
    expect(fetchedElections.length).toBe(3);
    fetchedElections.forEach(election => {
      expect(election.electionStatus).toBe(ELECTION_STATUS_PUBLIC);
      const allFields = keys(getFakeDomainElectionResponse());
      const isReturnedFieldsCorrect = keys(election).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should return null if election is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedElections = await electionRepository.findAll(
      {
        whereClause: { electionStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedElections).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
