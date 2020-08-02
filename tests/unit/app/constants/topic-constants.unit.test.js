'use strict';

const { keys } = require('lodash');
const CONSTANTS = require('../../../../app/constants/topic-constants.js');

test('Should confirm the constants', () => {
  expect(keys(CONSTANTS).sort()).toStrictEqual(
    ['TOPIC_STATUS_ACTIVE', 'TOPIC_STATUS_DELETED', 'TOPIC_STATUS_INACTIVE'].sort()
  );
});

test('Should confirm the contant values', () => {
  expect(CONSTANTS.TOPIC_STATUS_ACTIVE).toBe('ACTIVE');
  expect(CONSTANTS.TOPIC_STATUS_INACTIVE).toBe('INACTIVE');
  expect(CONSTANTS.TOPIC_STATUS_DELETED).toBe('DELETED');
});
