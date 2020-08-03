'use strict';

const ajvValidator = require('../../../../../app/validators/ajv-validator.js')({ logError: true });
const schema = require('../../../../../app/schemas/domain/audit-domain-schema.json');
const Services = require('../../../../../app/services');
const services = new Services();
const { timeService } = services;

test('Should return false if no fields passed', () => {
  expect(ajvValidator(schema, {})).toBeFalsy();
});

test('Should be able to validate schema with required fields', () => {
  expect(
    ajvValidator(schema, {
      createdAt: timeService.now()
    })
  ).toBeTruthy();
});

test('Should be able to validate schema with all fields', () => {
  expect(
    ajvValidator(schema, {
      createdAt: timeService.now(),
      updatedAt: timeService.now()
    })
  ).toBeTruthy();
});
