'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');
const AdminRepository = require('../../../../app/repositories/admin-repository.js');
const AdminMapper = require('../../../../app/mappers/admin-mapper.js');
const { ADMIN_ACCOUNT_STATUS_ACTIVE } = require('../../../../app/constants/admin-constants.js');

const services = new Services();
const { configService, knexService, uuidService, timeService, passwordService } = services;

const now = timeService.now();
const DB_QUERY_LIMIT = configService.dbQueryLimit;

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.adminMapper = new AdminMapper(this.auditMapper);
}

const mappers = new FakeMappers();
const adminRepository = new AdminRepository(mappers, configService, passwordService);

const getFakeDomainAdmin = (guid = uuidService.uuid()) => ({
  guid,
  firstName: 'Jane',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: `${guid}@example.com`,
  userName: `${guid}`,
  password: 'root1234',
  passcode: '123456',
  accountStatus: ADMIN_ACCOUNT_STATUS_ACTIVE,
  gender: 'FEMALE',
  countryCode: 'IND',
  audit: {
    createdAt: now
  }
});

const getFakeDomainAdminResponse = guid => ({
  guid,
  accountStatus: ADMIN_ACCOUNT_STATUS_ACTIVE,
  audit: {
    createdAt: now
  },
  countryCode: 'IND',
  emailId: `${guid}@example.com`,
  firstName: 'Jane',
  gender: 'FEMALE',
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
      { accountStatus: ADMIN_ACCOUNT_STATUS_ACTIVE, limit: 3, page: 1 },
      txn
    );
    expect(fetchedAdmins.length).toBe(3);
    fetchedAdmins.forEach(admin => {
      expect(admin.accountStatus).toBe(ADMIN_ACCOUNT_STATUS_ACTIVE);
    });
  });
});

test('Should return null if admin is not found - findByAccountStatus', async () => {
  return knexService.transaction(async txn => {
    const result = await adminRepository.findByAccountStatus({ accountStatus: 'hahaha' }, txn);
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
      audit: {
        createdAt: now,
        updatedAt: now
      },
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

test('Should be able to validate for login', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    await adminRepository.create(fakeDomainAdmin, txn);
    const fetchedAdmin = await adminRepository.validateForLogin(
      {
        emailId: fakeDomainAdmin.emailId,
        password: fakeDomainAdmin.password,
        passcode: fakeDomainAdmin.passcode
      },
      txn
    );
    expect(fetchedAdmin.guid).toBe(guid);
  });
});

test('Should return null if password is invalid for login', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainAdmin = getFakeDomainAdmin(guid);
    await adminRepository.create(fakeDomainAdmin, txn);
    const fetchedAdmin = await adminRepository.validateForLogin(
      {
        emailId: fakeDomainAdmin.emailId,
        password: 'wrong-password',
        passcode: fakeDomainAdmin.passcode
      },
      txn
    );
    expect(fetchedAdmin).toBeNull();
  });
});

test('Should return null if login validation fails - validateForLogin', async () => {
  return knexService.transaction(async txn => {
    const fetchedAdmin = await adminRepository.validateForLogin(
      {
        emailId: 'hahaha',
        password: 'hahaha',
        passcode: 'hahah'
      },
      txn
    );
    expect(fetchedAdmin).toBeNull();
  });
});

test('Should be able to find all admin without passing any params', async () => {
  return knexService.transaction(async txn => {
    const getFakeAdmin = () => getFakeDomainAdmin(uuidService.uuid());
    await Promise.all([
      adminRepository.create(getFakeAdmin(), txn),
      adminRepository.create(getFakeAdmin(), txn),
      adminRepository.create(getFakeAdmin(), txn)
    ]);
    const fetchedAdmins = await adminRepository.findAll({}, txn);
    expect(fetchedAdmins.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedAdmins.forEach(admin => {
      expect(admin.accountStatus).toBe(ADMIN_ACCOUNT_STATUS_ACTIVE);
      const allFields = keys(getFakeDomainAdminResponse());
      const isReturnedFieldsCorrect = keys(admin).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should be able to find all admin - with whereClause', async () => {
  return knexService.transaction(async txn => {
    const getFakeAdmin = () => getFakeDomainAdmin(uuidService.uuid());
    await Promise.all([
      adminRepository.create(getFakeAdmin(), txn),
      adminRepository.create(getFakeAdmin(), txn),
      adminRepository.create(getFakeAdmin(), txn)
    ]);
    const fetchedAdmins = await adminRepository.findAll(
      {
        whereClause: { accountStatus: ADMIN_ACCOUNT_STATUS_ACTIVE }
      },
      txn
    );
    expect(fetchedAdmins.length).toBeLessThanOrEqual(DB_QUERY_LIMIT);
    fetchedAdmins.forEach(admin => {
      expect(admin.accountStatus).toBe(ADMIN_ACCOUNT_STATUS_ACTIVE);
      const allFields = keys(getFakeDomainAdminResponse());
      const isReturnedFieldsCorrect = keys(admin).every(field => allFields.includes(field));
      expect(isReturnedFieldsCorrect).toBeTruthy();
    });
  });
});

test('Should return null if admin is not found - findAll', async () => {
  return knexService.transaction(async txn => {
    const fetchedAdmins = await adminRepository.findAll(
      {
        whereClause: { accountStatus: 'hahaha' },
        limit: DB_QUERY_LIMIT,
        page: 1
      },
      txn
    );
    expect(fetchedAdmins).toBeNull();
  });
});

afterAll(() => {
  return knexService.destroy();
});
