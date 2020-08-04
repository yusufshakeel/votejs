'use strict';

const objectMapper = require('object-mapper');

const adminApiToDomain = {
  firstName: 'firstName',
  middleName: 'middleName',
  lastName: 'lastName',
  emailId: 'emailId',
  userName: 'userName',
  password: 'password',
  passcode: 'passcode',
  accountStatus: 'accountStatus',
  gender: 'gender',
  countryCode: 'countryCode'
};

const adminDomainToApi = {
  guid: 'guid',
  firstName: 'firstName',
  middleName: 'middleName',
  lastName: 'lastName',
  emailId: 'emailId',
  userName: 'userName',
  password: 'password',
  passcode: 'passcode',
  accountStatus: 'accountStatus',
  gender: 'gender',
  countryCode: 'countryCode',
  audit: 'audit'
};

const adminDomainToDb = {
  guid: 'guid',
  firstName: 'firstName',
  middleName: 'middleName',
  lastName: 'lastName',
  emailId: 'emailId',
  userName: 'userName',
  password: 'password',
  passcode: 'passcode',
  accountStatus: 'accountStatus',
  gender: 'gender',
  countryCode: 'countryCode',
  'audit.createdAt': 'createdAt',
  'audit.updatedAt': 'updatedAt'
};

const adminDbToDomain = {
  guid: 'guid',
  firstName: 'firstName',
  middleName: 'middleName',
  lastName: 'lastName',
  emailId: 'emailId',
  userName: 'userName',
  password: 'password',
  passcode: 'passcode',
  accountStatus: 'accountStatus',
  gender: 'gender',
  countryCode: 'countryCode',
  createdAt: 'audit.createdAt',
  updatedAt: 'audit.updatedAt'
};

function AdminMapper(auditMapper) {
  this.apiToDomain = function (apiAdmin) {
    return objectMapper(apiAdmin, adminApiToDomain);
  };

  this.domainToApi = function (domainAdmin) {
    return objectMapper(domainAdmin, adminDomainToApi);
  };

  this.domainToDb = function (domainAdmin) {
    return objectMapper(domainAdmin, adminDomainToDb);
  };

  this.dbToDomain = function (dbAdmin) {
    return objectMapper(dbAdmin, adminDbToDomain);
  };

  this.updateDomainToDb = function (domainAdmin) {
    return objectMapper(
      {
        ...domainAdmin,
        ...auditMapper.updateDomainAudit()
      },
      adminDomainToDb
    );
  };
}

module.exports = AdminMapper;
