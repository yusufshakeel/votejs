'use strict';

const AuditMapper = require('./audit-mapper.js');
const CountryMapper = require('./country-mapper.js');
const AdminMapper = require('./admin-mapper.js');
const VoterMapper = require('./voter-mapper.js');
const CandidateMapper = require('./candidate-mapper.js');
const ElectionMapper = require('./election-mapper.js');
const ElectionCandidateMapper = require('./election-candidate-mapper.js');
const VoteCandidateMapper = require('./vote-candidate-mapper.js');
const TopicMapper = require('./topic-mapper.js');

function Mappers() {
  this.auditMapper = new AuditMapper();
  this.countryMapper = new CountryMapper();
  this.adminMapper = new AdminMapper(this.auditMapper);
  this.voterMapper = new VoterMapper(this.auditMapper);
  this.candidateMapper = new CandidateMapper(this.auditMapper);
  this.electionMapper = new ElectionMapper(this.auditMapper);
  this.electionCandidateMapper = new ElectionCandidateMapper(this.auditMapper);
  this.voteCandidateMapper = new VoteCandidateMapper(this.auditMapper);
  this.topicMapper = new TopicMapper(this.auditMapper);
}

module.exports = Mappers;
