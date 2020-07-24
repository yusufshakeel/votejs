'use strict';

const Services = require('../../../../app/services');
const Mappers = require('../../../../app/mappers');
const Repositories = require('../../../../app/repositories');

const services = new Services();
const mappers = new Mappers();
const { configService } = services;
const repositories = new Repositories(mappers, configService);
const { countryRepository } = repositories;

const fakeDomainCountry = function () {
  const str = Math.random().toString(36).substr(2);
  const digit = Math.random().toString(10).substr(2, 1);
  return {
    countryCode: `${str.substring(0, 3)}`,
    countryName: `${str}`,
    code: `${digit[0]}${str.substring(0, 1)}`
  };
};

const createFakeCountry = async function (txn) {
  return await countryRepository.create(fakeDomainCountry(), txn);
};

test('Should be able to create new entry in country table', async () => {
  return services.knexService.transaction(async txn => {
    const domainCountry = fakeDomainCountry();
    const result = await countryRepository.create(domainCountry, txn);
    expect(result).toStrictEqual(domainCountry);
  });
});

test('Should be able to fetch data by countryCode', async () => {
  return services.knexService.transaction(async txn => {
    const createdCountry = await createFakeCountry(txn);
    const fetchedCountry = await countryRepository.findByCountryCode(
      createdCountry.countryCode,
      txn
    );
    expect(fetchedCountry).toStrictEqual(createdCountry);
  });
});

test('Should return null when searching country by countryCode that does not exists', async () => {
  return services.knexService.transaction(async txn => {
    const fetchedCountry = await countryRepository.findByCountryCode('---', txn);
    expect(fetchedCountry).toBeNull();
  });
});

test('Should be able to fetch data by code', async () => {
  return services.knexService.transaction(async txn => {
    const createdCountry = await createFakeCountry(txn);
    const fetchedCountry = await countryRepository.findByCode(createdCountry.code, txn);
    expect(fetchedCountry).toStrictEqual(createdCountry);
  });
});

test('Should return null when searching country by code that does not exists', async () => {
  return services.knexService.transaction(async txn => {
    const fetchedCountry = await countryRepository.findByCode('--', txn);
    expect(fetchedCountry).toBeNull();
  });
});

test('Should be able to update by countryCode', async () => {
  return services.knexService.transaction(async txn => {
    const dataToUpdate = fakeDomainCountry();
    const createdCountry = await createFakeCountry(txn);
    const fetchedCountry = await countryRepository.updateByCountryCode(
      createdCountry.countryCode,
      dataToUpdate,
      txn
    );
    expect(fetchedCountry).toStrictEqual(dataToUpdate);
  });
});

test('Should be able to upsert - create', async () => {
  return services.knexService.transaction(async txn => {
    const domainCountry = fakeDomainCountry();
    const fetchedCountry = await countryRepository.upsert(domainCountry, txn);
    expect(fetchedCountry).toStrictEqual(domainCountry);
  });
});

test('Should be able to upsert - update', async () => {
  return services.knexService.transaction(async txn => {
    const domainCountry = fakeDomainCountry();
    const createdCountry = await countryRepository.create(domainCountry, txn);
    const fetchedCountry = await countryRepository.upsert(domainCountry, txn);
    expect(fetchedCountry).toStrictEqual(createdCountry);
  });
});

afterAll(() => {
  return services.knexService.destroy();
});
