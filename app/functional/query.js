'use strict';

const findBy = async ({ table, whereClause, columns, limit = 1, offset = 0, transaction }) =>
  transaction(table).select(columns).where(whereClause).limit(limit).offset(offset);

module.exports = {
  findBy
};
