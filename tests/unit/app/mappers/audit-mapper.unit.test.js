'use strict';

const moment = require('moment');
const AuditMapper = require('../../../../app/mappers/audit-mapper.js');

const now = moment().toDate();

function FakeTimeService() {
  this.now = function () {
    return now;
  };
}

const fakeTimeService = new FakeTimeService();
const auditMapper = new AuditMapper(fakeTimeService);

const domainAudit = {
  audit: {
    createdAt: now,
    updatedAt: now
  }
};

const dbAudit = {
  createdAt: now,
  updatedAt: now
};

test('Should be able to map domain to db', () => {
  expect(auditMapper.domainToDb(domainAudit)).toStrictEqual(dbAudit);
});

test('Should be able to map db to domain', () => {
  expect(auditMapper.dbToDomain(dbAudit)).toStrictEqual(domainAudit);
});

test('Should be able to create domain audit', () => {
  expect(auditMapper.createDomainAudit()).toStrictEqual({
    audit: {
      createdAt: now
    }
  });
});

test('Should be able to create db audit', () => {
  expect(auditMapper.createDbAudit()).toStrictEqual({
    createdAt: now
  });
});

test('Should be able to update domain audit', () => {
  expect(auditMapper.updateDomainAudit()).toStrictEqual({
    audit: {
      updatedAt: now
    }
  });
});
