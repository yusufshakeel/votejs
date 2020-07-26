'use strict';

const CountryRepository = require('./country-repository.js');
const AdminRepository = require('./admin-repository.js');
const VoterRepository = require('./voter-repository.js');
const CandidateRepository = require('./candidate-repository.js');
const ElectionRepository = require('./election-repository.js');
const ElectionConfigurationRepository = require('./election-configuration-repository.js');

function Repositories(mappers, configService) {
  this.countryRepository = new CountryRepository(mappers);
  this.adminRepository = new AdminRepository(mappers, configService);
  this.voterRepository = new VoterRepository(mappers, configService);
  this.candidateRepository = new CandidateRepository(mappers, configService);
  this.electionRepository = new ElectionRepository(mappers, configService);
  this.electionConfigurationRepository = new ElectionConfigurationRepository(
    mappers,
    configService
  );
}

module.exports = Repositories;
