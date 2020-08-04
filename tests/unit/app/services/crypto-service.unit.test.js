'use strict';

const ConfigService = require('../../../../app/services/config-service.js');
const CryptoService = require('../../../../app/services/crypto-service.js');

const configService = ConfigService();
const cryptoService = CryptoService(configService);

const plainText = 'Hello World';
const encryptedText = 'd1afa3ad91df91dafa897b8810bdfe31:876231b454cc5e617f37b56e4cf6d856';

test('Should be able to encrypt plain text', () => {
  const encryptedText = cryptoService.encrypt(plainText);
  expect(cryptoService.decrypt(encryptedText)).toBe(plainText);
});

test('Should be able to decrypt encrypted text', () => {
  expect(cryptoService.decrypt(encryptedText)).toBe(plainText);
});
