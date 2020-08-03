'use strict';

const Ajv = require('ajv');

function AjvValidator({ ajv = new Ajv({ removeAdditional: 'all' }), logError = false }) {
  return function (schema, data) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      logError ? console.error(validate.errors) : '';
      return false;
    }
    return true;
  };
}

module.exports = AjvValidator;
