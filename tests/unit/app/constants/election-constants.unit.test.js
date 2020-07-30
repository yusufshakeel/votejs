'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/election-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    [
      'ELECTION_STATUS_DELETED',
      'ELECTION_STATUS_DRAFT',
      'ELECTION_STATUS_PRIVATE',
      'ELECTION_STATUS_PUBLIC',
      'ELECTION_VOTE_ON_CANDIDATE'
    ].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.ELECTION_STATUS_DRAFT).toBe('DRAFT');
  expect(CONSTANTS.ELECTION_STATUS_PUBLIC).toBe('PUBLIC');
  expect(CONSTANTS.ELECTION_STATUS_PRIVATE).toBe('PRIVATE');
  expect(CONSTANTS.ELECTION_STATUS_DELETED).toBe('DELETED');
  expect(CONSTANTS.ELECTION_VOTE_ON_CANDIDATE).toBe('CANDIDATE');
});
