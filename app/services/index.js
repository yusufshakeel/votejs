'use strict';

const ConfigService = require('./config-service.js');
const KnexService = require('./knex-service.js');
const UUIDService = require('./uuid-service.js');
const TimeService = require('./time-service.js');
const LogService = require('./log-service.js');
const Base64Service = require('./base64-service.js');
const PasswordService = require('./password-service.js');
const StringifyService = require('./stringify-service.js');

function Services() {
  this.timeService = new TimeService();
  this.uuidService = new UUIDService();
  this.base64Service = Base64Service();
  this.configService = ConfigService();
  this.stringifyService = StringifyService();
  this.logService = LogService(this.configService);
  this.knexService = KnexService(this.configService);
  this.passwordService = new PasswordService(
    this.configService,
    this.base64Service,
    this.stringifyService
  );
}

module.exports = Services;
