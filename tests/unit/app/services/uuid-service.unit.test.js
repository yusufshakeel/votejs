'use strict';

const UUIDService = require('../../../../app/services/uuid-service.js');

test('Should return dummy uuid', () => {
  const uuidService = new UUIDService(() => 'dummy-uuid');
  expect(uuidService.uuid()).toBe('dummy-uuid');
});

test('Should return actual uuid v4', () => {
  const uuidService = new UUIDService();
  expect(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi.test(uuidService.uuid())).toBeTruthy();
});
