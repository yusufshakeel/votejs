'use strict';

const ajvValidator = require('../../../../../app/validators/ajv-validator.js')({});
const schema = require('../../../../../app/schemas/api/admin-create-api-schema.json');

test('Should return false if no fields passed', () => {
  expect(ajvValidator(schema, {})).toBeFalsy();
});

test('Should be able to validate schema with required fields', () => {
  expect(
    ajvValidator(schema, {
      firstName: 'Jane',
      emailId: 'jane@example.com',
      userName: 'janedoe',
      password: 'root1234',
      passcode: '123456',
      countryCode: 'IND'
    })
  ).toBeTruthy();
});

test('Should be able to validate schema with all fields', () => {
  expect(
    ajvValidator(schema, {
      firstName: 'Jane',
      middleName: 'Super',
      lastName: 'Doe',
      emailId: 'jane@example.com',
      userName: 'janedoe',
      password: 'root1234',
      passcode: '123456',
      gender: 'FEMALE',
      countryCode: 'IND'
    })
  ).toBeTruthy();
});
