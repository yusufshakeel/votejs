'use strict';

function TableRepository() {
  this.tables = {
    ADMIN: 'ADMIN',
    CANDIDATE: 'CANDIDATE',
    COUNTRY: 'COUNTRY',
    ELECTION: 'ELECTION',
    ELECTION_CANDIDATE: 'ELECTION_CANDIDATE',
    VOTE: 'VOTE',
    VOTER: 'VOTER'
  };

  this.column = table => column => `${table}.${column}`;
}

module.exports = TableRepository;
