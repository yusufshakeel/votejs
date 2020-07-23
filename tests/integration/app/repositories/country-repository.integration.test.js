'use strict';

const Services = require('../../../../app/services');
const Mappers = require('../../../../app/mappers');
const Repositories = require('../../../../app/repositories');

const services = new Services();
const mappers = new Mappers();
const repositories = new Repositories(mappers);
const { countryRepository } = repositories;

const fakeDomainCountry = function () {
  const uuid = services.uuidService.uuid();
  return {
    countryCode: `CC-${uuid}`,
    countryName: `CName-${uuid}`,
    code: `C-${uuid}`
  };
};

const createFakeCountry = async function (txn) {
  return await countryRepository.create(fakeDomainCountry(), txn);
};

test('Should be able to create new entry in country table', async () => {
  return services.knexService.transaction(async txn => {
    const domainCountry = fakeDomainCountry();
    const result = await countryRepository.create(domainCountry, txn);
    expect(result[0]).toStrictEqual(domainCountry);
  });
});

test('Should be able to fetch data by countryCode', async () => {
  return services.knexService.transaction(async txn => {
    const createdCountry = await createFakeCountry(txn);
    const firstCreated = createdCountry[0];
    const fetchedCountry = await countryRepository.findByCountryCode(firstCreated.countryCode, txn);
    const firstFetched = fetchedCountry[0];
    expect(firstFetched).toStrictEqual(firstCreated);
  });
});

test('Should be able to fetch data by code', async () => {
  return services.knexService.transaction(async txn => {
    const createdCountry = await createFakeCountry(txn);
    const firstCreated = createdCountry[0];
    const fetchedCountry = await countryRepository.findByCode(firstCreated.code, txn);
    const firstFetched = fetchedCountry[0];
    expect(firstFetched).toStrictEqual(firstCreated);
  });
});

test('Should be able to update by countryCode', async () => {
  return services.knexService.transaction(async txn => {
    const dataToUpdate = fakeDomainCountry();
    const createdCountry = await createFakeCountry(txn);
    const firstCreated = createdCountry[0];
    const result = await countryRepository.updateByCountryCode(
      firstCreated.countryCode,
      dataToUpdate,
      txn
    );
    const firstFetched = result[0];
    expect(firstFetched).toStrictEqual(dataToUpdate);
  });
});

test('Should be able to upsert - create', async () => {
  return services.knexService.transaction(async txn => {
    const domainCountry = fakeDomainCountry();
    const result = await countryRepository.upsert(domainCountry, txn);
    const firstFetched = result[0];
    expect(firstFetched).toStrictEqual(domainCountry);
  });
});

test('Should be able to upsert - update', async () => {
  return services.knexService.transaction(async txn => {
    const domainCountry = fakeDomainCountry();
    const createdCountry = await countryRepository.create(domainCountry, txn);
    const result = await countryRepository.upsert(domainCountry, txn);
    const firstFetched = result[0];
    expect(firstFetched).toStrictEqual(createdCountry[0]);
  });
});

afterAll(() => {
  return services.knexService.destroy();
});
