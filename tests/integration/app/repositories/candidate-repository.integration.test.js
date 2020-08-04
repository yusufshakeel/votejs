'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');
const CandidateRepository = require('../../../../app/repositories/candidate-repository.js');
const CandidateMapper = require('../../../../app/mappers/candidate-mapper.js');
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
}

const mappers = new FakeMappers();
const candidateRepository = new CandidateRepository(mappers, configService);

const getFakeDomainCandidate = (guid = uuidService.uuid()) => ({
  guid,
  candidateHandle: `${guid}`,
  displayHeader: 'displayHeader',
  summary: 'summary',
  candidateStatus: CANDIDATE_STATUS_ACTIVE,
  audit: {
    createdAt: now
  }
});

const getFakeDomainCandidateResponse = guid => ({
  guid,
  candidateHandle: `${guid}`,
  displayHeader: 'displayHeader',
  summary: 'summary',
  candidateStatus: CANDIDATE_STATUS_ACTIVE,
  audit: {
    createdAt: now
  }
});

test('Should be able to create new candidate', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await candidateRepository.create(getFakeDomainCandidate(guid), txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch candidate by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await candidateRepository.create(getFakeDomainCandidate(guid), txn);
    const result = await candidateRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(getFakeDomainCandidateResponse(guid));
  });
});

test('Should return null if candidate is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await candidateRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch candidate by candidateHandle', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainCandidate = getFakeDomainCandidate(guid);
    await candidateRepository.create(fakeDomainCandidate, txn);
    const result = await candidateRepository.findByCandidateHandle(
      fakeDomainCandidate.candidateHandle,
      txn
    );
    expect(result).toStrictEqual(getFakeDomainCandidateResponse(guid));
  });
});

test('Should return null if candidate is not found - findByCandidateHandle', async () => {
  return knexService.transaction(async txn => {
    const result = await candidateRepository.findByCandidateHandle('hahaha', txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch candidate by candidateStatus', async () => {
  return knexService.transaction(async txn => {
    const getFakeCandidate = () => getFakeDomainCandidate(uuidService.uuid());
    await Promise.all([
      candidateRepository.create(getFakeCandidate(), txn),
      candidateRepository.create(getFakeCandidate(), txn),
      candidateRepository.create(getFakeCandidate(), txn)
    ]);
    const fetchedCandidates = await candidateRepository.findByCandidateStatus(
      { candidateStatus: CANDIDATE_STATUS_ACTIVE, limit: 3, page: 1 },
      txn
    );
    expect(fetchedCandidates.length).toBe(3);
    fetchedCandidates.forEach(candidate => {
      expect(candidate.candidateStatus).toBe(CANDIDATE_STATUS_ACTIVE);
    });
  });
});

test('Should return null if candidate is not found - findByCandidateStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await candidateRepository.findByCandidateStatus(
      { candidateStatus: 'hahaha' },
      txn
    );
    expect(result).toBeNull();
  });
});

test('Should be able to update candidate', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainCandidate = getFakeDomainCandidate(guid);
    await candidateRepository.create(fakeDomainCandidate, txn);
    const dataToUpdate = {
      displayHeader: 'Updated Display Header'
    };
    const result = await candidateRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toStrictEqual({
      ...getFakeDomainCandidateResponse(guid),
      audit: {
        createdAt: now,
        updatedAt: now
      },
      displayHeader: dataToUpdate.displayHeader
    });
  });
});

test('Should return null when updating candidate that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      displayHeader: 'Updated Display Header'
    };
    const result = await candidateRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to find all candidate without passing any params', async () => {
  return knexService.transaction(async txn => {
    const getFakeCandidate = () => getFakeDomainCandidate(uuidService.uuid());
    await Promise.all([
      candidateRepository.create(getFakeCandidate(), txn),
      candidateRepository.create(getFakeCandidate(), txn),
      candidateRepository.create(getFakeCandidate(), txn)
    ]);
    const fetchedCandidates = await candidateRepository.findAll({}, txn);
    expect(fetchedCandidates.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedCandidates.forEach(candidate => {
      const allFields = keys(getFakeDomainCandidateResponse());
      const isReturnedFieldsCorrect = keys(candidate).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should be able to find all candidate - with whereClause', async () => {
  return knexService.transaction(async txn => {
    const getFakeCandidate = () => getFakeDomainCandidate(uuidService.uuid());
    await Promise.all([
      candidateRepository.create(getFakeCandidate(), txn),
      candidateRepository.create(getFakeCandidate(), txn),
      candidateRepository.create(getFakeCandidate(), txn)
    ]);
    const fetchedCandidates = await candidateRepository.findAll(
      { whereClause: { candidateStatus: CANDIDATE_STATUS_ACTIVE } },
      txn
    );
    expect(fetchedCandidates.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedCandidates.forEach(candidate => {
      const allFields = keys(getFakeDomainCandidateResponse());
      const isReturnedFieldsCorrect = keys(candidate).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should return null if candidate is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedCandidates = await candidateRepository.findAll(
      {
        whereClause: { candidateStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedCandidates).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
