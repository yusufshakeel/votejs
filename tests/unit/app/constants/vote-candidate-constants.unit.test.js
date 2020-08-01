'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/vote-candidate-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    [
      'VOTE_CANDIDATE_VOTE_STATUS_DELETED',
      'VOTE_CANDIDATE_VOTE_STATUS_INVALID',
      'VOTE_CANDIDATE_VOTE_STATUS_REVERTED',
      'VOTE_CANDIDATE_VOTE_STATUS_VALID'
    ].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.VOTE_CANDIDATE_VOTE_STATUS_VALID).toBe('VALID');
  expect(CONSTANTS.VOTE_CANDIDATE_VOTE_STATUS_INVALID).toBe('INVALID');
  expect(CONSTANTS.VOTE_CANDIDATE_VOTE_STATUS_REVERTED).toBe('REVERTED');
  expect(CONSTANTS.VOTE_CANDIDATE_VOTE_STATUS_DELETED).toBe('DELETED');
});
