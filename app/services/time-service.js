'use strict';

const momentjs = require('moment');

function TimeService(moment = momentjs) {
  this.now = function () {
    return moment().toDate();
  };

  this.nowAsISOString = function() {
    return moment().toISOString();
  };
}

module.exports = TimeService;
