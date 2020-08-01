'use strict';

function TableRepository() {
  this.tables = {
    ADMIN: 'ADMIN',
    CANDIDATE: 'CANDIDATE',
    COUNTRY: 'COUNTRY',
    ELECTION: 'ELECTION',
    ELECTION_CANDIDATE: 'ELECTION_CANDIDATE',
    VOTER: 'VOTER',
    VOTE_CANDIDATE: 'VOTE_CANDIDATE'
  };

  this.column = table => column => `${table}.${column}`;
}

module.exports = TableRepository;
