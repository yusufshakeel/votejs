'use strict';

const { keys } = require('lodash');
const Base64Service = require('../../../../app/services/base64-service.js');
const StringifyService = require('../../../../app/services/stringify-service.js');
const PasswordService = require('../../../../app/services/password-service.js');

const fakeConfigService = () => ({
  logLevel: 'info',
  passwordHashConfig: {
    algo: 'pbkdf2',
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
const fakeSalt = '47a1800ad507f80e018d97d1f515f809aac773ab5c22f0a69526f503bacbb6b4';
const fakeHashPassword =
  'eyJzYWx0IjoiNDdhMTgwMGFkNTA3ZjgwZTAxOGQ5N2QxZjUxNWY4MDlhYWM3NzNhYjVjMjJmMGE2OTUyNmY1MDNiYWNiYjZiNCIsImhhc2giOiJiZDY4N2I5MDY1YTE3OTBiZTI5YzEzNzc3MzU0ZWY4MDIxMzFjMjJmOTU4MmZkMzE2MTM2MmM1NDk0ZTI5NzVlNTAxODFhNTdhZTcxMGJkNDAyMTE0ZTc0YjNiYmY1MTZmZGM4MDU4ODFlNGI1ZmYwOTU3ZmY4OGQ0YzViZTY4ZjJjMzg5Y2I5MzU4NjI2ODkxZDRjYmRiNDYzM2MyZTRkZmE1ZDcxZTU2NmUwMjdlNTNiYzgyZGM3NzA5ZmYyYTM1MzczYWQzZmJhZmE2MTliMjFiNmViMWFhNTgzNTdhY2E2OTI5OGIxMTJhNzBkMTdhMzJkNmE5MjI2YTY0YmY5IiwiY29uZmlnIjp7ImFsZ28iOiJwYmtkZjIiLCJzYWx0U2l6ZSI6MzIsIml0ZXJhdGlvbnMiOjEwMjQsImtleWxlbiI6MTI4LCJkaWdlc3QiOiJzaGE1MTIifX0=';

test('Should be able to hash password', async () => {
  const hash = await passwordService.hashPassword(plainTextPassword);
  const jsonData = stringifyService.parsify(base64Service.decode(hash));
  expect(keys(jsonData).sort()).toStrictEqual(['salt', 'hash', 'config'].sort());
  expect(jsonData.config).toStrictEqual(configService.passwordHashConfig);
});

test('Should be able to hash password with given salt', async () => {
  const hash = await passwordService.hashPassword(plainTextPassword, fakeSalt);
  expect(hash).toBe(fakeHashPassword);
});

test('Should be able to verify password', async () => {
  const isValid = await passwordService.isValidPasswordHash(fakeHashPassword, plainTextPassword);
  expect(isValid).toBeTruthy();
});

test('Should fail when verifying password hash with invalid plain text password', async () => {
  const isValid = await passwordService.isValidPasswordHash(fakeHashPassword, 'dummy-password');
  expect(isValid).toBeFalsy();
});
