'use strict';

function AdminDispatcher({ mappers, services, repositories }) {
  const { adminMapper } = mappers;
  const { adminRepository } = repositories;
  const { knexService } = services;

  this.createAdmin = function (apiAdmin) {
    return knexService.transaction(async txn => {
      const domainAdmin = adminMapper.apiToDomain(apiAdmin);
      const createdAdmin = await adminRepository.create(domainAdmin, txn);
      return adminMapper.domainToApi(createdAdmin);
    });
  };

  this.findAdminByGuid = function (guid) {
    return knexService.transaction(async txn => {
      const fetchedAdmin = await adminRepository.findByGuid(guid, txn);
      return adminMapper.domainToApi(fetchedAdmin);
    });
  };

  this.findAdminByEmailId = function (emailId) {
    return knexService.transaction(async txn => {
      const fetchedAdmin = await adminRepository.findByEmailId(emailId, txn);
      return adminMapper.domainToApi(fetchedAdmin);
    });
  };

  this.findAdminByUserName = function (userName) {
    return knexService.transaction(async txn => {
      const fetchedAdmin = await adminRepository.findByUserName(userName, txn);
      return adminMapper.domainToApi(fetchedAdmin);
    });
  };

  this.findAdminByAccountStatus = function ({ accountStatus, limit, page }) {
    return knexService.transaction(async txn => {
      const fetchedAdmins = await adminRepository.findByAccountStatus(
        { accountStatus, limit, page },
        txn
      );
      return fetchedAdmins.map(fetchedAdmin => adminMapper.domainToApi(fetchedAdmin));
    });
  };

  this.updateAdmin = function (adminGuid, apiAdmin) {
    return knexService.transaction(async txn => {
      const domainAdmin = adminMapper.apiToDomain(apiAdmin);
      const updatedAdmin = await adminRepository.updateByGuid(adminGuid, domainAdmin, txn);
      return adminMapper.domainToApi(updatedAdmin);
    });
  };

  this.loginAdmin = function ({ userName, emailId, password, passcode }) {
    return knexService.transaction(async txn => {
      const fetchedAdmin = await adminRepository.validateForLogin(
        { userName, emailId, password, passcode },
        txn
      );
      return adminMapper.domainToApi(fetchedAdmin);
    });
  };
}

module.exports = AdminDispatcher;
