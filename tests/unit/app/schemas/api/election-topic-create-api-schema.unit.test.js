'use strict';

const ajvValidator = require('../../../../../app/validators/ajv-validator.js')({ logError: true });
const schema = require('../../../../../app/schemas/api/election-topic-create-api-schema.json');

test('Should return false if no fields passed', () => {
  expect(ajvValidator(schema, {})).toBeFalsy();
});

test('Should be able to validate schema with required fields', () => {
  expect(
    ajvValidator(schema, {
      electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
      topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b'
    })
  ).toBeTruthy();
});

test('Should be able to validate schema with all fields', () => {
  expect(
    ajvValidator(schema, {
      electionGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
      topicGuid: '9e17d7b7-c236-496f-92cd-10e1859fdd3b',
      electionTopicStatus: 'ACTIVE'
    })
  ).toBeTruthy();
});
