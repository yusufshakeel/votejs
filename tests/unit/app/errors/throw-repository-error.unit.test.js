'use strict';

const throwRepositoryError = require('../../../../app/errors/throw-repository-error.js');

function FakeRepository() {
  this.create = throwRepositoryError(async function (number) {
    if (isNaN(number) || number === 0) {
      throw new Error('Should be a number and not zero.');
    }
    return 10 / number;
  });
}

test('Should throw error', async () => {
  const repository = new FakeRepository();
  await expect(() => repository.create('abc')).rejects.toThrow();
});

test('Should not throw error', async () => {
  const repository = new FakeRepository();
  await expect(() => repository.create(10)).not.toThrow();
});
