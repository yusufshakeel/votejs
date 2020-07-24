'use strict';

const Services = require('../../../../app/services');
const Mappers = require('../../../../app/mappers');
const Repositories = require('../../../../app/repositories');

const services = new Services();
const mappers = new Mappers();
const { configService, knexService, uuidService, timeService } = services;
const repositories = new Repositories(mappers, configService);
const { adminRepository } = repositories;

const now = timeService.now();

const getFakeDomainAdmin = (guid = uuidService.uuid()) => ({
  guid: guid,
  firstName: 'Jane',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: `${guid}@example.com`,
  userName: `${guid}`,
  password: 'password-in-hash-form',
  passcode: '123456',
  accountStatus: 'ACTIVE',
  gender: 'FEMALE',
  countryCode: 'IND',
  audit: {
    createdAt: now
  }
});

const getFakeDomainAdminResponse = guid => ({
  accountStatus: 'ACTIVE',
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

test('Should be able to create new admin', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await adminRepository.create(getFakeDomainAdmin(guid), txn);
    expect(result.guid).toBe(guid);
  });
});

test('Should be able to fetch admin by guid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    await adminRepository.create(getFakeDomainAdmin(guid), txn);
    const result = await adminRepository.findByGuid(guid, txn);
    expect(result).toStrictEqual(getFakeDomainAdminResponse(guid));
  });
});

test('Should return null if admin is not found - findByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const result = await adminRepository.findByGuid(guid, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch admin by emailId', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    await adminRepository.create(fakeDomainAdmin, txn);
    const result = await adminRepository.findByEmailId(fakeDomainAdmin.emailId, txn);
    expect(result).toStrictEqual(getFakeDomainAdminResponse(guid));
  });
});

test('Should return null if admin is not found - findByEmailId', async () => {
  return knexService.transaction(async txn => {
    const result = await adminRepository.findByEmailId('hahaha@example.com', txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch admin by userName', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    await adminRepository.create(fakeDomainAdmin, txn);
    const result = await adminRepository.findByUserName(fakeDomainAdmin.userName, txn);
    expect(result).toStrictEqual(getFakeDomainAdminResponse(guid));
  });
});

test('Should return null if admin is not found - findByUserName', async () => {
  return knexService.transaction(async txn => {
    const result = await adminRepository.findByUserName('hahaha', txn);
    expect(result).toBeNull();
  });
});

test('Should be able to fetch admin by accountStatus', async () => {
  return knexService.transaction(async txn => {
    const getFakeAdmin = () => getFakeDomainAdmin(uuidService.uuid());
    await Promise.all([
      adminRepository.create(getFakeAdmin(), txn),
      adminRepository.create(getFakeAdmin(), txn),
      adminRepository.create(getFakeAdmin(), txn)
    ]);
    const fetchedAdmins = await adminRepository.findByAccountStatus(
      'ACTIVE',
      { limit: 3, page: 1 },
      txn
    );
    expect(fetchedAdmins.length).toBe(3);
    fetchedAdmins.forEach(admin => {
      expect(admin.accountStatus).toBe('ACTIVE');
    });
  });
});

test('Should return null if admin is not found - findByAccountStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await adminRepository.findByAccountStatus('hahaha', {}, txn);
    expect(result).toBeNull();
  });
});

test('Should be able to update admin', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    await adminRepository.create(fakeDomainAdmin, txn);
    const dataToUpdate = {
      firstName: 'updated first name',
      password: 'updated password'
    };
    const result = await adminRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toStrictEqual({
      ...getFakeDomainAdminResponse(guid),
      firstName: dataToUpdate.firstName
    });
  });
});

test('Should return null when updating admin that does not exists - updateByGuid', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const dataToUpdate = {
      firstName: 'updated first name',
      password: 'updated password'
    };
    const result = await adminRepository.updateByGuid(guid, dataToUpdate, txn);
    expect(result).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
