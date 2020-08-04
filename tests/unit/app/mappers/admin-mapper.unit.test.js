'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const AdminMapper = require('../../../../app/mappers/admin-mapper.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.adminMapper = new AdminMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { adminMapper } = mapper;

const fakeApiAdmin = {
  firstName: 'John',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: 'johnsuperdoe@example.com',
  userName: 'johndoe',
  password: '123',
  passcode: '1234',
  accountStatus: 'ACTIVE',
  gender: 'MALE',
  countryCode: 'IND'
};

const fakeDomainAdmin = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  firstName: 'John',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: 'johnsuperdoe@example.com',
  userName: 'johndoe',
  password: '123',
  passcode: '1234',
  accountStatus: 'ACTIVE',
  gender: 'MALE',
  countryCode: 'IND',
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbAdmin = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  firstName: 'John',
  middleName: 'Super',
  lastName: 'Doe',
  emailId: 'johnsuperdoe@example.com',
  userName: 'johndoe',
  password: '123',
  passcode: '1234',
  accountStatus: 'ACTIVE',
  gender: 'MALE',
  countryCode: 'IND',
  createdAt: now,
  updatedAt: now
};

test('Should be able to map Api to Domain', () => {
  expect(adminMapper.apiToDomain(fakeApiAdmin)).toStrictEqual({
    firstName: 'John',
    middleName: 'Super',
    lastName: 'Doe',
    emailId: 'johnsuperdoe@example.com',
    userName: 'johndoe',
    password: '123',
    passcode: '1234',
    accountStatus: 'ACTIVE',
    gender: 'MALE',
    countryCode: 'IND'
  });
});

test('Should be able to map Domain to Api', () => {
  expect(adminMapper.domainToApi(fakeDomainAdmin)).toStrictEqual({
    guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    firstName: 'John',
    middleName: 'Super',
    lastName: 'Doe',
    emailId: 'johnsuperdoe@example.com',
    userName: 'johndoe',
    password: '123',
    passcode: '1234',
    accountStatus: 'ACTIVE',
    gender: 'MALE',
    countryCode: 'IND',
    audit: {
      createdAt: now,
      updatedAt: now
    }
  });
});

test('Should be able to map domain to db', () => {
  expect(adminMapper.domainToDb(fakeDomainAdmin)).toStrictEqual(fakeDbAdmin);
});

test('Should be able to map db to Domain', () => {
  expect(adminMapper.dbToDomain(fakeDbAdmin)).toStrictEqual(fakeDomainAdmin);
});

test('Should be able to map update domain to db', () => {
  expect(
    adminMapper.updateDomainToDb({
      firstName: 'Jane',
      lastName: 'Doe'
    })
  ).toStrictEqual({
    firstName: 'Jane',
    lastName: 'Doe',
    updatedAt: now
  });
});
