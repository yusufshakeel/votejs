'use strict';

const { v4: uuidv4 } = require('uuid');

function UUIDService(uuid = uuidv4) {
  this.uuid = function() {
    return uuid();
  };
}

module.exports = UUIDService;
