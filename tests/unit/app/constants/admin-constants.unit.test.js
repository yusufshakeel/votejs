'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/admin-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    [
      'ADMIN_ACCOUNT_STATUS_ACTIVE',
      'ADMIN_ACCOUNT_STATUS_DELETED',
      'ADMIN_ACCOUNT_STATUS_INACTIVE'
    ].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.ADMIN_ACCOUNT_STATUS_ACTIVE).toBe('ACTIVE');
  expect(CONSTANTS.ADMIN_ACCOUNT_STATUS_INACTIVE).toBe('INACTIVE');
  expect(CONSTANTS.ADMIN_ACCOUNT_STATUS_DELETED).toBe('DELETED');
});
