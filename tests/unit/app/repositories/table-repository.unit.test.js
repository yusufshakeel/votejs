'use strict';

const { keys } = require('lodash');
const TableRepository = require('../../../../app/repositories/table-repository.js');

test('Should confirm the existence of required properties', () => {
  const tableRepository = new TableRepository();
  expect(keys(tableRepository.tables())).toStrictEqual([
    'ADMIN',
    'CANDIDATE',
    'COUNTRY',
    'ELECTION',
    'ELECTION_CONFIGURATION',
    'VOTE',
    'VOTER'
  ]);
});
