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
  db.createTable('ELECTION', {
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
    title: {
      type: 'string',
      maxLength: 1000,
      notNull: true
    },
    summary: {
      type: 'string'
    },
    startsAt: {
      type: 'timestamptz',
      notNull: true
    },
    endsAt: {
      type: 'timestamptz',
      notNull: true
    },
    electionStatus: {
      type: 'string',
      notNull: true,
      defaultValue: 'DRAFT'
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
  db.dropTable('ELECTION', {}, cb);
};

exports._meta = {
  'version': 1
};
