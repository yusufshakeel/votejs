'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');
const VoterRepository = require('../../../../app/repositories/voter-repository.js');
const VoterMapper = require('../../../../app/mappers/voter-mapper.js');
const { VOTER_ACCOUNT_STATUS_ACTIVE } = require('../../../../app/constants/voter-constants.js');

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
  this.voterMapper = new VoterMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const voterRepository = new VoterRepository(mappers, configService);

const getFakeDomainVoter = (guid = uuidService.uuid()) => ({
  guid: guid,
  firstName: 'Jane',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: `${guid}@example.com`,
  userName: `${guid}`,
  password: 'root1234',
  passcode: '123456',
  accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE,
  gender: 'FEMALE',
  countryCode: 'IND',
  audit: {
    createdAt: now
  }
});

const getFakeDomainVoterResponse = guid => ({
  accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE,
  audit: {
    createdAt: now
  },
  countryCode: 'IND',
  emailId: `${guid}@example.com`,
  firstName: 'Jane',
  gender: 'FEMALE',
  guid: `${guid}`,
  lastName: 'Doe',
  middleName: 'Super',
  userName: `${guid}`
});

test('Should be able to create new voter', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voterRepository.create(getFakeDomainVoter(guid), txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch voter by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await voterRepository.create(getFakeDomainVoter(guid), txn);
    const result = await voterRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(getFakeDomainVoterResponse(guid));
  });
});

test('Should return null if voter is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await voterRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch voter by emailId', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainVoter = getFakeDomainVoter(guid);
    await voterRepository.create(fakeDomainVoter, txn);
    const result = await voterRepository.findByEmailId(fakeDomainVoter.emailId, txn);
    expect(result).toStrictEqual(getFakeDomainVoterResponse(guid));
  });
});

test('Should return null if voter is not found - findByEmailId', async () => {
  return knexService.transaction(async txn => {
    const result = await voterRepository.findByEmailId('hahaha@example.com', txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch voter by userName', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainVoter = getFakeDomainVoter(guid);
    await voterRepository.create(fakeDomainVoter, txn);
    const result = await voterRepository.findByUserName(fakeDomainVoter.userName, txn);
    expect(result).toStrictEqual(getFakeDomainVoterResponse(guid));
  });
});

test('Should return null if voter is not found - findByUserName', async () => {
  return knexService.transaction(async txn => {
    const result = await voterRepository.findByUserName('hahaha', txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch voter by accountStatus', async () => {
  return knexService.transaction(async txn => {
    const getFakeVoter = () => getFakeDomainVoter(uuidService.uuid());
    await Promise.all([
      voterRepository.create(getFakeVoter(), txn),
      voterRepository.create(getFakeVoter(), txn),
      voterRepository.create(getFakeVoter(), txn)
    ]);
    const fetchedVoters = await voterRepository.findByAccountStatus(
      { accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE, limit: 3, page: 1 },
      txn
    );
    expect(fetchedVoters.length).toBe(3);
    fetchedVoters.forEach(voter => {
      expect(voter.accountStatus).toBe(VOTER_ACCOUNT_STATUS_ACTIVE);
    });
  });
});

test('Should return null if voter is not found - findByAccountStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await voterRepository.findByAccountStatus({ accountStatus: 'hahaha' }, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to update voter', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainVoter = getFakeDomainVoter(guid);
    await voterRepository.create(fakeDomainVoter, txn);
    const dataToUpdate = {
      firstName: 'updated first name',
      password: 'updated password'
    };
    const result = await voterRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toStrictEqual({
      ...getFakeDomainVoterResponse(guid),
      audit: {
        createdAt: now,
        updatedAt: now
      },
      firstName: dataToUpdate.firstName
    });
  });
});

test('Should return null when updating voter that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      firstName: 'updated first name',
      password: 'updated password'
    };
    const result = await voterRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to validate for login', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainVoter = getFakeDomainVoter(guid);
    await voterRepository.create(fakeDomainVoter, txn);
    const fetchedVoter = await voterRepository.validateForLogin(
      {
        emailId: fakeDomainVoter.emailId,
        password: fakeDomainVoter.password,
        passcode: fakeDomainVoter.passcode
      },
      txn
    );
    expect(fetchedVoter.guid).toBe(guid);
  });
});

test('Should return null if login validation fails - validateForLogin', async () => {
  return knexService.transaction(async txn => {
    const fetchedVoter = await voterRepository.validateForLogin(
      {
        emailId: 'hahaha',
        password: 'hahaha',
        passcode: 'hahah'
      },
      txn
    );
    expect(fetchedVoter).toBeNull();
  });
});

test('Should be able to find all voter without passing any params', async () => {
  return knexService.transaction(async txn => {
    const getFakeVoter = () => getFakeDomainVoter(uuidService.uuid());
    await Promise.all([
      voterRepository.create(getFakeVoter(), txn),
      voterRepository.create(getFakeVoter(), txn),
      voterRepository.create(getFakeVoter(), txn)
    ]);
    const fetchedVoters = await voterRepository.findAll({}, txn);
    expect(fetchedVoters.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedVoters.forEach(voter => {
      const allFields = keys(getFakeDomainVoterResponse());
      const isReturnedFieldsCorrect = keys(voter).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should be able to find all voter - with whereClause', async () => {
  return knexService.transaction(async txn => {
    const getFakeVoter = () => getFakeDomainVoter(uuidService.uuid());
    await Promise.all([
      voterRepository.create(getFakeVoter(), txn),
      voterRepository.create(getFakeVoter(), txn),
      voterRepository.create(getFakeVoter(), txn)
    ]);
    const fetchedVoters = await voterRepository.findAll(
      {
        whereClause: { accountStatus: VOTER_ACCOUNT_STATUS_ACTIVE },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedVoters.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedVoters.forEach(voter => {
      const allFields = keys(getFakeDomainVoterResponse());
      const isReturnedFieldsCorrect = keys(voter).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should return null if voter is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedVoters = await voterRepository.findAll(
      {
        whereClause: { accountStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedVoters).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
