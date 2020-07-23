'use strict';

const stringifyService = require('../../../../app/services/stringify-service.js')();

test('Should be able to stringify json data - stringify', () => {
  expect(stringifyService.stringify({ a: '1', b: '2' })).toStrictEqual('{"a":"1","b":"2"}');
});

test('Should return "{}" if data is {} - stringify', () => {
  expect(stringifyService.stringify({})).toStrictEqual('{}');
});

test('Should return "[]" if data is [] - stringify', () => {
  expect(stringifyService.stringify([])).toStrictEqual('[]');
});

test('Should return string value if data is a string - stringify', () => {
  expect(stringifyService.stringify('hello')).toStrictEqual('"hello"');
});

test('Should return number as string value if data is a number - stringify', () => {
  expect(stringifyService.stringify(123)).toStrictEqual('123');
});

test('Should return boolean value if data is a boolean value - stringify', () => {
  expect(stringifyService.stringify(true)).toBeTruthy();
  expect(stringifyService.stringify(false)).toBeFalsy();
});

test('Should return "null" if data is infinity - stringify', () => {
  expect(stringifyService.stringify(Infinity)).toBe('null');
  expect(stringifyService.stringify(-Infinity)).toBe('null');
});

test('Should return null if no data is passed - stringify', () => {
  expect(stringifyService.stringify()).toBeNull();
});

test('Should return null if data is an empty space - stringify', () => {
  expect(stringifyService.stringify('')).toBeNull();
});

test('Should return null if data is undefined - stringify', () => {
  expect(stringifyService.stringify(undefined)).toBeNull();
});

test('Should return null if data is null - stringify', () => {
  expect(stringifyService.stringify(null)).toBeNull();
});

test('Should return null if data is NaN - stringify', () => {
  expect(stringifyService.stringify(NaN)).toBeNull();
});

test('Should be able to parse stringified json data - parsify', () => {
  expect(stringifyService.parsify('{"a":"1","b":"2"}')).toStrictEqual({ a: '1', b: '2' });
});

test('Should return number if data is number - parsify', () => {
  expect(stringifyService.parsify(1)).toBe(1);
});

test('Should return boolean value if data is a boolean - parsify', () => {
  expect(stringifyService.parsify(true)).toBeTruthy();
  expect(stringifyService.parsify(false)).toBeFalsy();
});

test('Should return null if data is {} - parsify', () => {
  expect(stringifyService.parsify({})).toBeNull();
});

test('Should return null if data is [] - parsify', () => {
  expect(stringifyService.parsify([])).toBeNull();
});

test('Should return null if data is not set - parsify', () => {
  expect(stringifyService.parsify()).toBeNull();
});

test('Should return null if data is an empty string - parsify', () => {
  expect(stringifyService.parsify('')).toBeNull();
});

test('Should return null if data is string - parsify', () => {
  expect(stringifyService.parsify('hello')).toBeNull();
});

test('Should return null if data is undefined - parsify', () => {
  expect(stringifyService.parsify(undefined)).toBeNull();
});

test('Should return null if data is null - parsify', () => {
  expect(stringifyService.parsify(null)).toBeNull();
});

test('Should return null if data is NaN - parsify', () => {
  expect(stringifyService.parsify(NaN)).toBeNull();
});

test('Should return null if data is Infinity - parsify', () => {
  expect(stringifyService.parsify(Infinity)).toBeNull();
  expect(stringifyService.parsify(-Infinity)).toBeNull();
});
