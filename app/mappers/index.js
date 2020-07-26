'use strict';

const AuditMapper = require('./audit-mapper.js');
const CountryMapper = require('./country-mapper.js');
const AdminMapper = require('./admin-mapper.js');
const VoterMapper = require('./voter-mapper.js');
const CandidateMapper = require('./candidate-mapper.js');
const ElectionMapper = require('./election-mapper.js');
const ElectionConfigurationMapper = require('./election-configuration-mapper.js');

function Mappers() {
  this.auditMapper = new AuditMapper();
  this.countryMapper = new CountryMapper();
  this.adminMapper = new AdminMapper(this.auditMapper);
  this.voterMapper = new VoterMapper(this.auditMapper);
  this.candidateMapper = new CandidateMapper(this.auditMapper);
  this.electionMapper = new ElectionMapper(this.auditMapper);
  this.electionConfigurationMapper = new ElectionConfigurationMapper(this.auditMapper);
}

module.exports = Mappers;
