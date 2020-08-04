'use strict';

const ajvValidator = require('../../../../../app/validators/ajv-validator.js')({ logError: true });
const schema = require('../../../../../app/schemas/api/topic-create-api-schema.json');

test('Should return false if no fields passed', () => {
  expect(ajvValidator(schema, {})).toBeFalsy();
});

test('Should be able to validate schema with required fields', () => {
  expect(
    ajvValidator(schema, {
      title: 'some title',
      topicStatus: 'ACTIVE'
    })
  ).toBeTruthy();
});

test('Should be able to validate schema with all fields', () => {
  expect(
    ajvValidator(schema, {
      title: 'some title',
      summary: 'some summary',
      topicStatus: 'ACTIVE'
    })
  ).toBeTruthy();
});
