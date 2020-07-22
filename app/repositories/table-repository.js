'use strict';

function TableRepository() {
  this.tables = function () {
    return {
      ADMIN: 'ADMIN',
      CANDIDATE: 'CANDIDATE',
      COUNTRY: 'COUNTRY',
      ELECTION: 'ELECTION',
      ELECTION_CONFIGURATION: 'ELECTION_CONFIGURATION',
      VOTE: 'VOTE',
      VOTER: 'VOTER'
    };
  };
}

module.exports = TableRepository;
