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
  return db.createTable('CANDIDATE', {
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
      notNull: true,
      defaultValue: new String('uuid_generate_v4()')
    },
    candidateHandle: {
      type: 'string',
      unique: true,
      notNull: true,
      length: 128
    },
    displayHeader: {
      type: 'string',
      length: 500,
      notNull: true
    },
    summary: {
      type: 'string'
    },
    candidateStatus: {
      type: 'string',
      notNull: true,
      defaultValue: 'ACTIVE'
    },
    createdAt: {
      type: 'timestamptz',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: 'timestamptz'
    }
  }, cb);
};

exports.down = function (db, cb) {
  return db.dropTable('CANDIDATE', {}, cb);
};

exports._meta = {
  'version': 1
};
