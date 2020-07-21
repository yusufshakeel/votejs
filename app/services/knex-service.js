'use strict';

const Knex = require('knex');

module.exports = function KnexService(configService) {
  return Knex({
    client: 'pg',
    connection: {
      ...configService.database.postgres
    },
    pool: {
      min: configService.connectionPool.knex.min,
      max: configService.connectionPool.knex.max,
      idleTimeoutMillis: configService.connectionPool.knex.idleTimeoutMillis
    },
    acquireConnectionTimeout: configService.connectionPool.knex.acquireConnectionTimeout
  });
};
