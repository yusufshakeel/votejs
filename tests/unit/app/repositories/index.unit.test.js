'use strict';

const { keys } = require('lodash');
const Repositories = require('../../../../app/repositories');
const Mappers = require('../../../../app/mappers');
const ConfigService = require('../../../../app/services/config-service.js');
const PasswordService = require('../../../../app/services/password-service.js');
const Base64Service = require('../../../../app/services/base64-service.js');
const StringifyService = require('../../../../app/services/stringify-service.js');

test('Should confirm the existence of required properties', () => {
  const mappers = new Mappers();
  const configService = ConfigService();
  const base64Service = Base64Service();
  const stringifyService = StringifyService();
  const passwordService = new PasswordService(configService, base64Service, stringifyService);
  const repositories = new Repositories({ mappers, configService, passwordService });
  expect(keys(repositories).sort()).toStrictEqual(
    [
      'countryRepository',
      'adminRepository',
      'voterRepository',
      'candidateRepository',
      'electionRepository',
      'electionCandidateRepository',
      'voteCandidateRepository',
      'topicRepository',
      'electionTopicRepository',
      'voteTopicRepository'
    ].sort()
  );
});
