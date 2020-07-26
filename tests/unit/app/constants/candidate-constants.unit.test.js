'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/candidate-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    ['CANDIDATE_STATUS_ACTIVE', 'CANDIDATE_STATUS_DELETED', 'CANDIDATE_STATUS_INACTIVE'].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.CANDIDATE_STATUS_ACTIVE).toBe('ACTIVE');
  expect(CONSTANTS.CANDIDATE_STATUS_INACTIVE).toBe('INACTIVE');
  expect(CONSTANTS.CANDIDATE_STATUS_DELETED).toBe('DELETED');
});
