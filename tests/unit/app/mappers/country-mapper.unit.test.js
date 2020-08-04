'use strict';

const TimeService = require('../../../../app/services/time-service.js');
const CountryMapper = require('../../../../app/mappers/country-mapper.js');

const timeService = new TimeService();

const now = timeService.now();

function FakeAuditMapper() {
  this.updateDomainAudit = function () {
    return { audit: { updatedAt: now } };
  };
}

function FakeMappers() {
  this.auditMapper = new FakeAuditMapper();
  this.countryMapper = new CountryMapper(this.auditMapper);
}

const mapper = new FakeMappers();
const { countryMapper } = mapper;

const fakeApiCountry = {
  countryCode: 'IND',
  countryName: 'India',
  code: 'IN'
};

const fakeDomainCountry = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  countryCode: 'IND',
  countryName: 'India',
  code: 'IN',
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const fakeDbCountry = {
  guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
  countryCode: 'IND',
  countryName: 'India',
  code: 'IN',
  createdAt: now,
  updatedAt: now
};

test('Should be able to map api to domain', () => {
  expect(countryMapper.apiToDomain(fakeApiCountry)).toStrictEqual({
    countryCode: 'IND',
    countryName: 'India',
    code: 'IN'
  });
});

test('Should be able to map domain to api', () => {
  expect(countryMapper.domainToApi(fakeDomainCountry)).toStrictEqual({
    guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
    countryCode: 'IND',
    countryName: 'India',
    code: 'IN',
    audit: {
      createdAt: now,
      updatedAt: now
    }
  });
});

test('Should be able to map domain to db', () => {
  expect(countryMapper.domainToDb(fakeDomainCountry)).toStrictEqual(fakeDbCountry);
});

test('Should be able to map db to domain', () => {
  expect(countryMapper.dbToDomain(fakeDbCountry)).toStrictEqual(fakeDomainCountry);
});

test('Should be able to map update domain to db', () => {
  expect(
    countryMapper.updateDomainToDb({
      code: 'IN'
    })
  ).toStrictEqual({
    code: 'IN',
    updatedAt: now
  });
});
