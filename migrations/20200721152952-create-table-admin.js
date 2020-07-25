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
  return db.createTable('ADMIN', {
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
    firstName: {
      type: 'string',
      length: 255,
      notNull: true
    },
    middleName: {
      type: 'string',
      length: 255
    },
    lastName: {
      type: 'string',
      length: 255
    },
    emailId: {
      type: 'string',
      unique: true,
      notNull: true,
      length: 300
    },
    userName: {
      type: 'string',
      unique: true,
      notNull: true,
      length: 100
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
      type: 'string',
      notNull: true,
      length: 3,
      foreignKey: {
        name: 'ADMIN_countryCode_COUNTRY_countryCode_fk',
        table: 'COUNTRY',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'countryCode'
      }
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
  return db.dropTable('ADMIN', {}, cb);
};

exports._meta = {
  'version': 1
};
