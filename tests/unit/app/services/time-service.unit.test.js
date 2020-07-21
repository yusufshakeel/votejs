'use strict';

const TimeService = require('../../../../app/services/time-service.js');

const fakeMoment = () => ({
  toDate: () => '2020-01-01T10:20:30.000Z',
  toISOString: () => '2020-01-01T10:20:30.000Z'
});

test('Should be able to return current date time - now()', () => {
  const timeService = new TimeService(fakeMoment);
  expect(timeService.now()).toBe(fakeMoment().toDate());
});

test('Should be able to return current date time - nowAsISOString()', () => {
  const timeService = new TimeService(fakeMoment);
  expect(timeService.nowAsISOString()).toBe(fakeMoment().toISOString());
});
