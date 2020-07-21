'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, cb) {
  db.runSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  db.createTable('ADMIN', {
    id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    guid: {
      type: 'uuid',
      unique: true,
      notNull: true
    },
    firstName: {
      type: 'string',
      maxLength: 255,
      notNull: true
    },
    middleName: {
      type: 'string',
      maxLength: 255
    },
    lastName: {
      type: 'string',
      maxLength: 255
    },
    emailId: {
      type: 'string',
      unique: true,
      notNull: true,
      maxLength: 300
    },
    userName: {
      type: 'string',
      unique: true,
      notNull: true,
      maxLength: 100
    },
    password: {
      type: 'string',
      notNull: true
    },
    passcode: {
      type: 'string',
      notNull: true
    },
    accountStatus: {
      type: 'string',
      notNull: true
    },
    gender: {
      type: 'string',
    },
    countryCode: {
      type: 'string'
    },
    createdAt: {
      type: 'timestamptz',
      notNull: true
    },
    updatedAt: {
      type: 'timestamptz'
    }
  }, cb);
};

exports.down = function (db, cb) {
  db.dropTable('ADMIN', {}, cb);
};

exports._meta = {
  'version': 1
};
