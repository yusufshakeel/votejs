'use strict';

const crypto = require('crypto');

function CryptoService(configService) {
  const {
    encryptionAlgorithm: ENCRYPTION_ALGORITHM,
    encryptionKey: ENCRYPTION_KEY,
    encryptionIVLength: IV_LENGTH
  } = configService;

  const encrypt = function (plainText) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    const encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  };

  const decrypt = function (encryptedText) {
    const encryptedTextParts = encryptedText.split(':');
    const iv = Buffer.from(encryptedTextParts.shift(), 'hex');
    const bufferText = Buffer.from(encryptedTextParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    const decrypted = Buffer.concat([decipher.update(bufferText), decipher.final()]);
    return decrypted.toString();
  };

  return { encrypt, decrypt };
}

module.exports = CryptoService;
