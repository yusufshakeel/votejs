'use strict';

const crypto = require('crypto');

function PasswordService(configService, base64Service, stringifyService) {
  const { passwordHashConfig: DEFAULT_CONFIG } = configService;

  const generateSalt = function (config) {
    return crypto.randomBytes(config.saltSize).toString('hex');
  };

  this.hashPassword = function (
    plainTextPassword,
    salt = generateSalt(DEFAULT_CONFIG),
    config = DEFAULT_CONFIG
  ) {
    const hash = crypto.pbkdf2Sync(
      plainTextPassword,
      salt,
      config.iterations,
      config.keylen,
      config.digest
    );
    return base64Service.encode(
      stringifyService.stringify({
        salt,
        hash: hash.toString('hex'),
        config
      })
    );
  };

  this.isValidPasswordHash = function (hashedPassword, plainTextPassword) {
    const decodedData = stringifyService.parsify(base64Service.decode(hashedPassword));
    const hash = this.hashPassword(plainTextPassword, decodedData.salt, decodedData.config);
    return hash === hashedPassword;
  };
}

module.exports = PasswordService;
