'use strict';

const JsonStringifySafe = require('json-stringify-safe');

function StringifyService() {
  const stringify = function (data) {
    return data ? JsonStringifySafe(data) : null;
  };

  const parsify = function (data) {
    try {
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  };

  return { stringify, parsify };
}

module.exports = StringifyService;
