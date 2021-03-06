'use strict';

const config = require('config');

function ConfigService() {
  const nodeEnvironment = config.get('nodeEnvironment');

  const logLevel = config.get('logLevel');

  const encryptionAlgorithm = config.get('encryptionAlgorithm');
  const encryptionKey = config.get('encryptionKey');
  const encryptionIVLength = config.get('encryptionIVLength');

  const database = {
    postgres: {
      host: config.get('database.postgres.host'),
      user: config.get('database.postgres.user'),
      password: config.get('database.postgres.password'),
      database: config.get('database.postgres.database'),
      port: config.get('database.postgres.port')
    }
  };

  const dbQueryLimit = config.get('dbQuery.limit');

  const connectionPool = {
    knex: {
      min: config.get('connectionPool.knex.min'),
      max: config.get('connectionPool.knex.max'),
      acquireConnectionTimeout: config.get('connectionPool.knex.acquireConnectionTimeout'),
      idleTimeoutMillis: config.get('connectionPool.knex.idleTimeoutMillis')
    }
  };

  const passwordHashConfig = {
    algo: config.get('passwordHashing.algo'),
    saltSize: config.get('passwordHashing.saltSize'),
    iterations: config.get('passwordHashing.iterations'),
    keylen: config.get('passwordHashing.keylen'),
    digest: config.get('passwordHashing.digest')
  };

  return {
    nodeEnvironment,
    encryptionAlgorithm,
    encryptionKey,
    encryptionIVLength,
    logLevel,
    database,
    dbQueryLimit,
    connectionPool,
    passwordHashConfig
  };
}

module.exports = ConfigService;
