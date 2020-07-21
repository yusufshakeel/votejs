'use strict';

const ConfigService = require('./config-service.js');
const KnexService = require('./knex-service.js');

module.exports = function Services() {
  this.configService = ConfigService();
  this.knex = KnexService(this.configService);
};
