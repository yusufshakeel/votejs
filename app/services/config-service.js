'use strict';

const config = require('config');

module.exports = function ConfigService() {
  const nodeEnvironment = config.get('nodeEnvironment');

  const database = {
    postgres: {
      host: config.get('database.postgres.host'),
      user: config.get('database.postgres.user'),
      password: config.get('database.postgres.password'),
      database: config.get('database.postgres.database'),
      port: config.get('database.postgres.port')
    }
  };

  const connectionPool = {
    knex: {
      min: config.get('connectionPool.knex.min'),
      max: config.get('connectionPool.knex.max'),
      acquireConnectionTimeout: config.get('connectionPool.knex.acquireConnectionTimeout'),
      idleTimeoutMillis: config.get('connectionPool.knex.idleTimeoutMillis')
    }
  };

  return {
    nodeEnvironment,
    database,
    connectionPool
  };
};