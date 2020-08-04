'use strict';

function Base64Service() {
  const encode = function (data) {
    return Buffer.from(data).toString('base64');
  };

  const decode = function (data) {
    return Buffer.from(data, 'base64').toString('ascii');
  };

  return { encode, decode };
}

module.exports = Base64Service;
