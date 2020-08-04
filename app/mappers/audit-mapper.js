'use strict';

const objectMapper = require('object-mapper');
const TimeService = require('../services/time-service.js');

const auditDomainToDb = {
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const auditDbToDomain = {
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function AuditMapper(timeService = new TimeService()) {
  this.domainToDb = function (domainAudit) {
    return objectMapper(domainAudit, auditDomainToDb);
  };

  this.dbToDomain = function (dbAudit) {
    return objectMapper(dbAudit, auditDbToDomain);
  };

  this.createDomainAudit = function () {
    return {
      audit: {
        createdAt: timeService.now()
      }
    };
  };

  this.createDbAudit = function () {
    return {
      createdAt: timeService.now()
    };
  };

  this.updateDomainAudit = function () {
    return {
      audit: {
        updatedAt: timeService.now()
      }
    };
  };
}

module.exports = AuditMapper;
