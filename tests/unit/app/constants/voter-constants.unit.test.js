'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/voter-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    [
      'VOTER_ACCOUNT_STATUS_ACTIVE',
      'VOTER_ACCOUNT_STATUS_DELETED',
      'VOTER_ACCOUNT_STATUS_INACTIVE',
      'VOTER_ACCOUNT_STATUS_SUSPENDED'
    ].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.VOTER_ACCOUNT_STATUS_ACTIVE).toBe('ACTIVE');
  expect(CONSTANTS.VOTER_ACCOUNT_STATUS_INACTIVE).toBe('INACTIVE');
  expect(CONSTANTS.VOTER_ACCOUNT_STATUS_SUSPENDED).toBe('SUSPENDED');
  expect(CONSTANTS.VOTER_ACCOUNT_STATUS_DELETED).toBe('DELETED');
});
