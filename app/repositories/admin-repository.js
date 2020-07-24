'use strict';

const { isEmpty, first } = require('lodash');
const TableRepository = require('./table-repository.js');
const tableRepository = new TableRepository();
const T = tableRepository.tables();

const columnsToReturn = [
  'guid',
  'firstName',
  'middleName',
  'lastName',
  'emailId',
  'userName',
  'accountStatus',
  'gender',
  'countryCode',
  'createdAt',
  'updatedAt'
];

function AdminRepository(mappers, configService) {
  const { adminMapper } = mappers;
  const { dbQueryLimit: DB_QUERY_LIMIT } = configService;

  const findBy = async function ({
    whereClause,
    columns,
    limit = DB_QUERY_LIMIT,
    offset = 0,
    transaction
  }) {
    return transaction(T.ADMIN).select(columns).where(whereClause).limit(limit).offset(offset);
  };

  this.create = async function (domainAdmin, transaction) {
    const dbAdmin = adminMapper.domainToDb(domainAdmin);
    const result = await transaction(T.ADMIN).insert(dbAdmin).returning(columnsToReturn);
    return adminMapper.dbToDomain(first(result));
  };

  this.findByGuid = async function (guid, transaction) {
    const result = await findBy({
      whereClause: { guid },
      columns: columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  this.findByEmailId = async function (emailId, transaction) {
    const result = await findBy({
      whereClause: { emailId },
      columns: columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  this.findByUserName = async function (userName, transaction) {
    const result = await findBy({
      whereClause: { userName },
      columns: columnsToReturn,
      transaction
    });
    if (isEmpty(result)) return null;
    return adminMapper.dbToDomain(first(result));
  };

  this.findByAccountStatus = async function (
    accountStatus,
    { limit = DB_QUERY_LIMIT, page = 1 },
    transaction
  ) {
    const result = await findBy({
      whereClause: { accountStatus },
      columns: columnsToReturn,
      limit,
      offset: (page - 1) * limit,
      transaction
    });
    if (isEmpty(result)) return null;
    return result.map(row => adminMapper.dbToDomain(row));
  };

  this.updateByGuid = async function (guid, domainAdmin, transaction) {
    const fetchedAdmin = await this.findByGuid(guid, transaction);
    if (isEmpty(fetchedAdmin)) return null;
    const dbAdmin = adminMapper.domainToDb(domainAdmin);
    const result = await transaction(T.ADMIN)
      .update(dbAdmin)
      .where({ guid })
      .returning(columnsToReturn);
    return adminMapper.dbToDomain(first(result));
  };
}

module.exports = AdminRepository;
