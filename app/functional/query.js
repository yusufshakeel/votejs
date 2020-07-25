'use strict';

const insertQuery = async ({ table, dataToInsert, columnsToReturn = ['guid'], transaction }) =>
  transaction(table).insert(dataToInsert).returning(columnsToReturn);

const selectQuery = async ({
  table,
  whereClause,
  columnsToReturn = ['guid'],
  limit = 1,
  offset = 0,
  transaction
}) => transaction(table).select(columnsToReturn).where(whereClause).limit(limit).offset(offset);

const updateQuery = async ({
  table,
  whereClause,
  dataToUpdate,
  columnsToReturn = ['guid'],
  transaction
}) => transaction(table).update(dataToUpdate).where(whereClause).returning(columnsToReturn);

module.exports = {
  insertQuery,
  updateQuery,
  selectQuery
};
