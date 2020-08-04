'use strict';

const { keys } = require('lodash');
const Base64Service = require('../../../../app/services/base64-service.js');
const StringifyService = require('../../../../app/services/stringify-service.js');
const PasswordService = require('../../../../app/services/password-service.js');

const fakeConfigService = () => ({
  logLevel: 'info',
  passwordHashConfig: {
    algo: 'PBKDF2',
    saltSize: 32,
    iterations: 1024,
    keylen: 128,
    digest: 'sha512'
  }
});
const base64Service = Base64Service();
const configService = fakeConfigService();
const stringifyService = StringifyService();
const passwordService = new PasswordService(configService, base64Service, stringifyService);

const plainTextPassword = 'Hello World This Is My Plain Text Password';
const fakeSalt =
  'dd5d0d5128856fd96e4e63acbb99af984fe9748fac036db8a6fa9f5d1eebc3f52035fa3423a5e0fa4b0ed766b9c92c81976523530641252946b3c1d2e8ef6c87';
const fakeHashPassword =
  'eyJzYWx0IjoiZGQ1ZDBkNTEyODg1NmZkOTZlNGU2M2FjYmI5OWFmOTg0ZmU5NzQ4ZmFjMDM2ZGI4YTZmYTlmNWQxZWViYzNmNTIwMzVmYTM0MjNhNWUwZmE0YjBlZDc2NmI5YzkyYzgxOTc2NTIzNTMwNjQxMjUyOTQ2YjNjMWQyZThlZjZjODciLCJoYXNoIjoiNWYzNTNmM2UxNzc1NzhjNzMzMjI2OTM2YmEzZmQ2MmZmNzkzOWQ3MmMwNGI2MjY5Y2JjNDJjYzlhZGYwM2U2ZGM1ZTBlODRiZmNlOGMxNDRmMzQxMDdkZDJjZTBkNjZiZTE4YzZmOTI1Y2Q1MGEyMWM0YmM3MmZiYjIyYmUwN2M5YTM3NDRmYThmOWQyNzhlNWJmNmYwNjllYzA1NjZiNTMyZjYzODEzOWU1MjVlNWI3YzQyOTE3ZmFkZTBlNzViZDNkYjU0YmRmZDA0YTEyOGVhNDg3ZGYzOTMyOGQ1NmEyZjgxYWY0N2U5YzhkNzBiM2NlYTIzMjAyNGQ4YjJiMSIsImNvbmZpZyI6eyJhbGdvIjoiUEJLREYyIiwic2FsdFNpemUiOjMyLCJpdGVyYXRpb25zIjoxMDI0LCJrZXlsZW4iOjEyOCwiZGlnZXN0Ijoic2hhNTEyIn19';

test('Should be able to hash password', () => {
  const hash = passwordService.hashPassword(plainTextPassword);
  const jsonData = stringifyService.parsify(base64Service.decode(hash));
  expect(keys(jsonData).sort()).toStrictEqual(['salt', 'hash', 'config'].sort());
  expect(jsonData.config).toStrictEqual(configService.passwordHashConfig);
});

test('Should be able to hash password with given salt', () => {
  const hash = passwordService.hashPassword(plainTextPassword, fakeSalt);
  expect(hash).toBe(fakeHashPassword);
});

test('Should be able to verify password', () => {
  expect(passwordService.isValidPasswordHash(fakeHashPassword, plainTextPassword)).toBeTruthy();
});

test('Should fail when verifying password hash with invalid plain text password', () => {
  expect(passwordService.isValidPasswordHash(fakeHashPassword, 'dummy-password')).toBeFalsy();
});
