'use strict';

const insert = async ({ table, dataToInsert, columnsToReturn = ['guid'], transaction }) =>
  transaction(table).insert(dataToInsert).returning(columnsToReturn);

const select = async ({
  table,
  whereClause,
  columns = ['guid'],
  limit = 1,
  offset = 0,
  transaction
}) => transaction(table).select(columns).where(whereClause).limit(limit).offset(offset);

const update = async ({
  table,
  whereClause,
  dataToUpdate,
  columnsToReturn = ['guid'],
  transaction
}) => transaction(table).update(dataToUpdate).where(whereClause).returning(columnsToReturn);

module.exports = {
  insert,
  update,
  select
};
