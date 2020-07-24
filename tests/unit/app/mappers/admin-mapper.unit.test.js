'use strict';

const Mappers = require('../../../../app/mappers');
const mapper = new Mappers();
const { adminMapper } = mapper;

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
    createdAt: '2020-07-22T18:03:16.533Z',
    updatedAt: '2020-07-22T18:03:16.533Z'
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
  createdAt: '2020-07-22T18:03:16.533Z',
  updatedAt: '2020-07-22T18:03:16.533Z'
};

test('Should be able to map domain to db', () => {
  expect(adminMapper.domainToDb(fakeDomainAdmin)).toStrictEqual(fakeDbAdmin);
});

test('Should be able to map db to Domain', () => {
  expect(adminMapper.dbToDomain(fakeDbAdmin)).toStrictEqual(fakeDomainAdmin);
});
