'use strict';

function TableRepository() {
  this.tables = function () {
    return {
      ADMIN: 'ADMIN',
      CANDIDATE: 'CANDIDATE',
      COUNTRY: 'COUNTRY',
      ELECTION: 'ELECTION',
      ELECTION_CANDIDATE: 'ELECTION_CANDIDATE',
      VOTE: 'VOTE',
      VOTER: 'VOTER'
    };
  };
}

module.exports = TableRepository;
