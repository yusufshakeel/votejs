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
}

module.exports = AdminDispatcher;
