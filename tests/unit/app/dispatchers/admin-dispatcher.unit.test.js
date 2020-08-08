'use strict';

const Mappers = require('../../../../app/mappers');
const AdminDispatcher = require('../../../../app/dispatchers/admin-dispatcher.js');
const mappers = new Mappers();

test('Should be able to create admin', async () => {
  const repositories = {
    adminRepository: {
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
  const adminDispatcher = new AdminDispatcher({ mappers, services, repositories });
  await adminDispatcher.createAdmin({
    guid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
  });
  expect(repositories.adminRepository.create.mock.calls.length).toBe(1);
});
