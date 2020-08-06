'use strict';

const { promisify } = require('es6-promisify');
const crypto = require('crypto');
const pbkdf2 = promisify(crypto.pbkdf2);
const randomBytes = promisify(crypto.randomBytes);

function PasswordService(configService, base64Service, stringifyService) {
  const self = this;
  const { passwordHashConfig: DEFAULT_CONFIG } = configService;

  const toHex = data => data.toString('hex');

  const generateSalt = async function (config) {
    return randomBytes(config.saltSize).then(buffer => toHex(buffer));
  };

  this.hashPassword = async function (plainTextPassword, salt, config = DEFAULT_CONFIG) {
    const saltForHash = salt ? salt : await generateSalt(DEFAULT_CONFIG);
    const hash = await pbkdf2(
      plainTextPassword,
      saltForHash,
      config.iterations,
      config.keylen,
      config.digest
    ).then(buffer => toHex(buffer));
    return base64Service.encode(
      stringifyService.stringify({
        salt: saltForHash,
        hash,
        config
      })
    );
  };

  this.isValidPasswordHash = async function (hashedPassword, plainTextPassword) {
    const decodedData = stringifyService.parsify(base64Service.decode(hashedPassword));
    const hash = await self.hashPassword(plainTextPassword, decodedData.salt, decodedData.config);
    return hash === hashedPassword;
  };
}

module.exports = PasswordService;
