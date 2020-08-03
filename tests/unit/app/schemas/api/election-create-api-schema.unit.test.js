'use strict';

const Services = require('../../../../../app/services');
const ajvValidator = require('../../../../../app/validators/ajv-validator.js')({ logError: true });
const schema = require('../../../../../app/schemas/api/election-create-api-schema.json');
const services = new Services();
const { timeService } = services;

test('Should return false if no fields passed', () => {
  expect(ajvValidator(schema, {})).toBeFalsy();
});

test('Should be able to validate schema with required fields', () => {
  expect(
    ajvValidator(schema, {
      title: 'some title',
      startsAt: timeService.now(),
      endsAt: timeService.now(),
      voteOn: 'CANDIDATE',
      electionSettings: {
        voter: {
          totalNumberOfVotesAllowed: 1,
          isVoteDeletingAllowed: false,
          isVoteRevertingAllowed: false
        }
      }
    })
  ).toBeTruthy();
});

test('Should be able to validate schema with all fields', () => {
  expect(
    ajvValidator(schema, {
      title: 'some title',
      summary: 'some summary',
      startsAt: timeService.now(),
      endsAt: timeService.now(),
      voteOn: 'CANDIDATE',
      electionStatus: 'DRAFT',
      electionSettings: {
        voter: {
          totalNumberOfVotesAllowed: 1,
          isVoteDeletingAllowed: false,
          isVoteRevertingAllowed: false
        }
      }
    })
  ).toBeTruthy();
});
