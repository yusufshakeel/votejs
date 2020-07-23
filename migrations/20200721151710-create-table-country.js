'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, cb) {
  return db.createTable('COUNTRY', {
    countryCode: {
      type: 'string',
      length: 3,
      notNull: true,
      unique: true,
      primaryKey: true
    },
    countryName: {
      type: 'string',
      length: 200,
      notNull: true
    },
    code: {
      type: 'string',
      length: 2,
      unique: true
    }
  }, cb);
};

exports.down = function(db, cb) {
  return db.dropTable('COUNTRY', {}, cb);
};

exports._meta = {
  "version": 1
};
