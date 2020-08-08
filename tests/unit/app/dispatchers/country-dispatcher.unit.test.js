'use strict';

const Mappers = require('../../../../app/mappers');
const CountryDispatcher = require('../../../../app/dispatchers/country-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create country', async () => {
  const repositories = {
    countryRepository: {
      create: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const countryDispatcher = new CountryDispatcher({ mappers, services, repositories });
  await countryDispatcher.createCountry({
    countryCode: 'IND'
  });
  expect(repositories.countryRepository.create.mock.calls.length).toBe(1);
});

test('Should be able to fetch country by countryCode', async () => {
  const repositories = {
    countryRepository: {
      findByCountryCode: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const countryDispatcher = new CountryDispatcher({ mappers, services, repositories });
  await countryDispatcher.findCountryByCountryCode('IND');
  expect(repositories.countryRepository.findByCountryCode.mock.calls.length).toBe(1);
});

test('Should be able to fetch country by code', async () => {
  const repositories = {
    countryRepository: {
      findByCode: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const countryDispatcher = new CountryDispatcher({ mappers, services, repositories });
  await countryDispatcher.findCountryByCode('IN');
  expect(repositories.countryRepository.findByCode.mock.calls.length).toBe(1);
});

test('Should be able to update country by countryCode', async () => {
  const repositories = {
    countryRepository: {
      updateByCountryCode: jest.fn(() => {
        return {
          guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
        };
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const countryDispatcher = new CountryDispatcher({ mappers, services, repositories });
  await countryDispatcher.updateCountryByCountryCode('IND', {
    countryName: 'India'
  });
  expect(repositories.countryRepository.updateByCountryCode.mock.calls.length).toBe(1);
});

test('Should be able to fetch all countries', async () => {
  const repositories = {
    countryRepository: {
      findAllCountries: jest.fn(() => {
        return [
          {
            guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
          }
        ];
      })
    }
  };
  const services = {
    knexService: {
      transaction: async f => f()
    }
  };
  const countryDispatcher = new CountryDispatcher({ mappers, services, repositories });
  await countryDispatcher.findAllCountries();
  expect(repositories.countryRepository.findAllCountries.mock.calls.length).toBe(1);
});
