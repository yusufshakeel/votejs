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

test('Should be able to fetch admin by guid', async () => {
  const repositories = {
    adminRepository: {
      findByGuid: jest.fn(() => {
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
  await adminDispatcher.findAdminByGuid('9e17d7b7-c236-496f-92cd-10e1859fdd3b');
  expect(repositories.adminRepository.findByGuid.mock.calls.length).toBe(1);
});

test('Should be able to fetch admin by emailId', async () => {
  const repositories = {
    adminRepository: {
      findByEmailId: jest.fn(() => {
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
  await adminDispatcher.findAdminByEmailId('janedoe@example.com');
  expect(repositories.adminRepository.findByEmailId.mock.calls.length).toBe(1);
});

test('Should be able to fetch admin by userName', async () => {
  const repositories = {
    adminRepository: {
      findByUserName: jest.fn(() => {
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
  await adminDispatcher.findAdminByUserName('janedoe');
  expect(repositories.adminRepository.findByUserName.mock.calls.length).toBe(1);
});

test('Should be able to fetch admin by accountStatus', async () => {
  const repositories = {
    adminRepository: {
      findByAccountStatus: jest.fn(() => {
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
  const adminDispatcher = new AdminDispatcher({ mappers, services, repositories });
  await adminDispatcher.findAdminByAccountStatus('ACTIVE');
  expect(repositories.adminRepository.findByAccountStatus.mock.calls.length).toBe(1);
});

test('Should be able to update admin by guid', async () => {
  const repositories = {
    adminRepository: {
      updateByGuid: jest.fn(() => {
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
  await adminDispatcher.updateAdmin('9e17d7b7-c236-496f-92cd-10e1859fdd3b', { firstName: 'Jane' });
  expect(repositories.adminRepository.updateByGuid.mock.calls.length).toBe(1);
});

test('Should be able to validate admin login', async () => {
  const repositories = {
    adminRepository: {
      validateForLogin: jest.fn(() => {
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
  await adminDispatcher.loginAdmin({
    userName: 'janedoe',
    emailId: 'janedoe@example.com',
    password: 'root1234',
    passcode: '123456'
  });
  expect(repositories.adminRepository.validateForLogin.mock.calls.length).toBe(1);
});
