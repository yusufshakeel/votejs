'use strict';

const Ajv = require('ajv');
const Services = require('../services');
const {
  logService: { ERROR }
} = new Services();

function AjvValidator({ ajv = new Ajv({ removeAdditional: 'all' }), logError = false }) {
  return function (schema, data) {
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid && logError) {
      ERROR(validate.errors);
    }
    return isValid;
  };
}

module.exports = AjvValidator;
