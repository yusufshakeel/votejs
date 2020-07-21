'use strict';

const ConfigService = require('./config-service.js');
const KnexService = require('./knex-service.js');
const UUIDService = require('./uuid-service.js');
const TimeService = require('./time-service.js');

module.exports = function Services() {
  this.timeService = new TimeService();
  this.uuidService = new UUIDService();
  this.configService = ConfigService();
  this.knexService = KnexService(this.configService);
};
