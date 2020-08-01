'use strict';

const AdminRepository = require('./admin-repository.js');
const CandidateRepository = require('./candidate-repository.js');
const CountryRepository = require('./country-repository.js');
const ElectionCandidateRepository = require('./election-candidate-repository.js');
const ElectionRepository = require('./election-repository.js');
const VoterRepository = require('./voter-repository.js');
const VoteCandidateRepository = require('./vote-candidate-repository.js');

function Repositories(mappers, configService) {
  this.countryRepository = new CountryRepository(mappers);
  this.adminRepository = new AdminRepository(mappers, configService);
  this.voterRepository = new VoterRepository(mappers, configService);
  this.candidateRepository = new CandidateRepository(mappers, configService);
  this.electionRepository = new ElectionRepository(mappers, configService);
  this.electionCandidateRepository = new ElectionCandidateRepository(mappers, configService);
  this.voteCandidateRepository = new VoteCandidateRepository(mappers, configService);
}

module.exports = Repositories;
