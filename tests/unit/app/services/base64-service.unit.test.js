'use strict';

const Base64Service = require('../../../../app/services/base64-service.js');
const base64Service = Base64Service();

test('Should be able to encode plain text to base64 string', () => {
  expect(base64Service.encode('Hello World')).toBe('SGVsbG8gV29ybGQ=');
});

test('Should be able to decode base64 string to plain text', () => {
  expect(base64Service.decode('SGVsbG8gV29ybGQ=')).toBe('Hello World');
});
