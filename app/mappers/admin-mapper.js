'use strict';

const objectMapper = require('object-mapper');

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

function AdminMapper() {
  this.domainToDb = function (domainAdmin) {
    return objectMapper(domainAdmin, adminDomainToDb);
  };

  this.dbToDomain = function (dbAdmin) {
    return objectMapper(dbAdmin, adminDbToDomain);
  };
}

module.exports = AdminMapper;
