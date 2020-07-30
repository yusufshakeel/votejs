'use strict';

const { keys } = require('lodash');
const TableRepository = require('../../../../app/repositories/table-repository.js');
const tableRepository = new TableRepository();

test('Should confirm the existence of required properties', () => {
  expect(keys(tableRepository.tables)).toStrictEqual([
    'ADMIN',
    'CANDIDATE',
    'COUNTRY',
    'ELECTION',
    'ELECTION_CANDIDATE',
    'VOTE',
    'VOTER'
  ]);
});

test('Should be able to give table with column', () => {
  const { tables: T, column: tableColumn } = tableRepository;
  expect(tableColumn(T.ELECTION)('guid')).toBe('ELECTION.guid');
});
