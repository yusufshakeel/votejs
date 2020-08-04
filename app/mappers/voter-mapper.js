'use strict';

const objectMapper = require('object-mapper');

const voterApiToDomain = {
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

const voterDomainToApi = {
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

const voterDomainToDb = {
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

const voterDbToDomain = {
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

function VoterMapper(auditMapper) {
  this.apiToDomain = function (apiVoter) {
    return objectMapper(apiVoter, voterApiToDomain);
  };

  this.domainToApi = function (domainVoter) {
    return objectMapper(domainVoter, voterDomainToApi);
  };

  this.domainToDb = function (domainVoter) {
    return objectMapper(domainVoter, voterDomainToDb);
  };

  this.dbToDomain = function (dbVoter) {
    return objectMapper(dbVoter, voterDbToDomain);
  };

  this.updateDomainToDb = function (domainVoter) {
    return objectMapper(
      {
        ...domainVoter,
        ...auditMapper.updateDomainAudit()
      },
      voterDomainToDb
    );
  };
}

module.exports = VoterMapper;
