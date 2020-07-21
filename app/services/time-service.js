'use strict';

const momentjs = require('moment');

module.exports = function TimeService(moment = momentjs) {
  this.now = function () {
    return moment().toDate();
  };

  this.nowAsISOString = function() {
    return moment().toISOString();
  };
};
