'use strict';

function TableRepository() {
  this.tables = {
    ADMIN: 'ADMIN',
    CANDIDATE: 'CANDIDATE',
    COUNTRY: 'COUNTRY',
    ELECTION: 'ELECTION',
    ELECTION_CANDIDATE: 'ELECTION_CANDIDATE',
    VOTER: 'VOTER',
    VOTE_CANDIDATE: 'VOTE_CANDIDATE',
    TOPIC: 'TOPIC',
    ELECTION_TOPIC: 'ELECTION_TOPIC',
    VOTE_TOPIC: 'VOTE_TOPIC'
  };

  this.column = table => column => `${table}.${column}`;
}

module.exports = TableRepository;
