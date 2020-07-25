'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const VoterMapper = require('../../../../app/mappers/voter-mapper.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.voterMapper = new VoterMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { voterMapper } = mapper;

const fakeDomainVoter = {
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

const fakeDbVoter = {
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

test('Should be able to map domain to db', () => {
  expect(voterMapper.domainToDb(fakeDomainVoter)).toStrictEqual(fakeDbVoter);
});

test('Should be able to map db to Domain', () => {
  expect(voterMapper.dbToDomain(fakeDbVoter)).toStrictEqual(fakeDomainVoter);
});

test('Should be able to map update domain to db', () => {
  expect(
    voterMapper.updateDomainToDb({
      firstName: 'Jane',
      lastName: 'Doe'
    })
  ).toStrictEqual({
    firstName: 'Jane',
    lastName: 'Doe',
    updatedAt: now
  });
});
