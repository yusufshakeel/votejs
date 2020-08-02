'use strict';

const { keys } = require('lodash');
const Mappers = require('../../../../app/mappers');

test('Should confirm the existence of required properties', () => {
  const mappers = new Mappers();
  expect(keys(mappers).sort()).toStrictEqual(
    [
      'auditMapper',
      'countryMapper',
      'adminMapper',
      'voterMapper',
      'candidateMapper',
      'electionMapper',
      'electionCandidateMapper',
      'voteCandidateMapper',
      'topicMapper'
    ].sort()
  );
});
