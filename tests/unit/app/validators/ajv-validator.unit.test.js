'use strict';

const AjvValidator = require('../../../../app/validators/ajv-validator.js');

const schema = {
  $id: 'someSchema',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string'
    }
  }
};

test('Should return true for valid data', () => {
  const validator = AjvValidator({});
  expect(validator(schema, { name: 'janedoe' })).toBeTruthy();
});

test('Should return false for invalid data', () => {
  const validator = AjvValidator({});
  expect(validator(schema, { foo: 'bar' })).toBeFalsy();
});

test('Should return false for invalid data - with logging error set to true', () => {
  const validator = AjvValidator({ logError: true });
  expect(validator(schema, { foo: 'bar' })).toBeFalsy();
});
