'use strict';
const Services = require('../services');
const {
  logService: { ERROR }
} = new Services();

function throwRepositoryError(op) {
  return async function (...params) {
    try {
      return await op(...params);
    } catch (err) {
      ERROR('throwRepositoryError', 'ERROR', err);
      throw err;
    }
  };
}

module.exports = throwRepositoryError;
