'use strict';

const AuditMapper = require('./audit-mapper.js');
const CountryMapper = require('./country-mapper.js');
const AdminMapper = require('./admin-mapper.js');
const VoterMapper = require('./voter-mapper.js');

function Mappers() {
  this.auditMapper = new AuditMapper();
  this.countryMapper = new CountryMapper();
  this.adminMapper = new AdminMapper(this.auditMapper);
  this.voterMapper = new VoterMapper(this.auditMapper);
}

module.exports = Mappers;
