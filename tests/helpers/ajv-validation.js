'use strict';

const Ajv = require('ajv');
const ajvInstance = new Ajv({ removeAdditional: 'all' });

module.exports = function ({ ajv = ajvInstance, logError = false }) {
  return function (schema, data) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      logError ? console.error(validate.errors) : '';
      return false;
    }
    return true;
  };
};
