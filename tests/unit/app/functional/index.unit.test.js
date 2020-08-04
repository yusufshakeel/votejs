'use strict';

const { keys } = require('lodash');
const functional = require('../../../../app/functional');

test('Should confirm the existence of required properties', () => {
  expect(keys(functional).sort()).toStrictEqual(['update', 'query'].sort());
});
