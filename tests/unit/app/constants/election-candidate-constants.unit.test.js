'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/election-candidate-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    [
      'ELECTION_CANDIDATE_STATUS_ACTIVE',
      'ELECTION_CANDIDATE_STATUS_DELETED',
      'ELECTION_CANDIDATE_STATUS_INACTIVE'
    ].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.ELECTION_CANDIDATE_STATUS_ACTIVE).toBe('ACTIVE');
  expect(CONSTANTS.ELECTION_CANDIDATE_STATUS_INACTIVE).toBe('INACTIVE');
  expect(CONSTANTS.ELECTION_CANDIDATE_STATUS_DELETED).toBe('DELETED');
});
