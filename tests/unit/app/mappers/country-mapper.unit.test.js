'use strict';

const Mappers = require('../../../../app/mappers');
const mapper = new Mappers();
const {countryMapper} = mapper;

test('Should be able to map domain to db', () => {
  const domainCountry = {
    countryCode: 'IND',
    countryName: 'India',
    code: 'IN'
  };
  const expectedDbCountry = {
    countryCode: 'IND',
    countryName: 'India',
    code: 'IN'
  };
  expect(countryMapper.domainToDb(domainCountry)).toStrictEqual(expectedDbCountry);
});

test('Should be able to map db to domain', () => {
  const dbCountry = {
    countryCode: 'IND',
    countryName: 'India',
    code: 'IN'
  };
  const expectedDomainCountry = {
    countryCode: 'IND',
    countryName: 'India',
    code: 'IN'
  };
  expect(countryMapper.dbToDomain(dbCountry)).toStrictEqual(expectedDomainCountry);
});
