'use strict';

const { keys } = require('lodash');
const Services = require('../../../../app/services');
const CountryRepository = require('../../../../app/repositories/country-repository.js');
const CountryMapper = require('../../../../app/mappers/country-mapper.js');

const services = new Services();
const { knexService, uuidService, timeService } = services;

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

const mappers = new FakeMappers();
const countryRepository = new CountryRepository(mappers);

const getFakeDomainCountry = (guid = uuidService.uuid()) => {
  const str = Math.random().toString(36).substr(2);
  const digit = Math.random().toString(10).substr(2, 1);
  return {
    guid,
    countryCode: `${str.substring(0, 3)}`,
    countryName: `${str}`,
    code: `${digit[0]}${str.substring(0, 1)}`,
    audit: {
      createdAt: now
    }
  };
};

const createFakeCountry = async function (txn) {
  return await countryRepository.create(getFakeDomainCountry(), txn);
};

test('Should be able to create new entry in country table', async () => {
  return knexService.transaction(async txn => {
    const domainCountry = getFakeDomainCountry();
    const result = await countryRepository.create(domainCountry, txn);
    expect(result).toStrictEqual(domainCountry);
  });
});

test('Should be able to fetch data by countryCode', async () => {
  return knexService.transaction(async txn => {
    const createdCountry = await createFakeCountry(txn);
    const fetchedCountry = await countryRepository.findByCountryCode(
      createdCountry.countryCode,
      txn
    );
    expect(fetchedCountry).toStrictEqual(createdCountry);
  });
});

test('Should return null when searching country by countryCode that does not exists', async () => {
  return knexService.transaction(async txn => {
    const fetchedCountry = await countryRepository.findByCountryCode('---', txn);
    expect(fetchedCountry).toBeNull();
  });
});

test('Should be able to fetch data by code', async () => {
  return knexService.transaction(async txn => {
    const createdCountry = await createFakeCountry(txn);
    const fetchedCountry = await countryRepository.findByCode(createdCountry.code, txn);
    expect(fetchedCountry).toStrictEqual(createdCountry);
  });
});

test('Should return null when searching country by code that does not exists', async () => {
  return knexService.transaction(async txn => {
    const fetchedCountry = await countryRepository.findByCode('--', txn);
    expect(fetchedCountry).toBeNull();
  });
});

test('Should be able to update by countryCode', async () => {
  return knexService.transaction(async txn => {
    const guid = uuidService.uuid();
    const fakeDomainCountry = getFakeDomainCountry(guid);
    await countryRepository.create(fakeDomainCountry, txn);
    const dataToUpdate = {
      countryName: 'Updated Country Name'
    };
    const result = await countryRepository.updateByCountryCode(
      fakeDomainCountry.countryCode,
      dataToUpdate,
      txn
    );
    expect(result).toStrictEqual({
      ...fakeDomainCountry,
      audit: {
        createdAt: now,
        updatedAt: now
      },
      countryName: dataToUpdate.countryName
    });
  });
});

test('Should return null when updating by countryCode that does not exists', async () => {
  return knexService.transaction(async txn => {
    const fetchedCountry = await countryRepository.updateByCountryCode(
      '---',
      {
        countryName: 'Updated Country Name'
      },
      txn
    );
    expect(fetchedCountry).toBeNull();
  });
});

test('Should be able to upsert - create', async () => {
  return knexService.transaction(async txn => {
    const domainCountry = getFakeDomainCountry();
    const fetchedCountry = await countryRepository.upsert(domainCountry, txn);
    expect(fetchedCountry).toStrictEqual(domainCountry);
  });
});

test('Should be able to upsert - update', async () => {
  return knexService.transaction(async txn => {
    const domainCountry = getFakeDomainCountry();
    const createdCountry = await countryRepository.create(domainCountry, txn);
    const fetchedCountry = await countryRepository.upsert(domainCountry, txn);
    expect(fetchedCountry).toStrictEqual({
      ...createdCountry,
      audit: {
        createdAt: now,
        updatedAt: now
      }
    });
  });
});

test('Should be able to fetch all countries', async () => {
  return knexService.transaction(async txn => {
    const fetchedCountries = await countryRepository.findAllCountries(txn);
    fetchedCountries.forEach(country => {
      expect(keys(country).sort()).toStrictEqual(
        ['guid', 'countryCode', 'countryName', 'code', 'audit'].sort()
      );
    });
  });
});

afterAll(() => {
  return knexService.destroy();
});
