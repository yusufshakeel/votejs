'use strict';

const { isEmpty } = require('lodash');
const throwRepositoryError = require('../errors/throw-repository-error.js');

const insertQuery = throwRepositoryError(
  async ({ table, dataToInsert, columnsToReturn = ['guid'], transaction }) =>
    transaction(table).insert(dataToInsert).returning(columnsToReturn)
);

const selectQuery = throwRepositoryError(
  async ({
    table,
    whereClause,
    columnsToReturn = ['guid'],
    limit = 1,
    offset = 0,
    orderBy = [{ column: 'createdAt', order: 'desc' }],
    transaction
  }) => {
    if (isEmpty(whereClause)) {
      return transaction
        .select(columnsToReturn)
        .from(table)
        .limit(limit)
        .offset(offset)
        .orderBy(orderBy);
    }
    return transaction
      .select(columnsToReturn)
      .from(table)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);
  }
);

const updateQuery = throwRepositoryError(
  async ({ table, whereClause, dataToUpdate, columnsToReturn = ['guid'], transaction }) =>
    transaction(table).update(dataToUpdate).where(whereClause).returning(columnsToReturn)
);

const pagination = ({ limit = 1, page = 1 }) => ({ limit, offset: (page - 1) * limit });

module.exports = {
  insertQuery,
  updateQuery,
  selectQuery,
  pagination
};
