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
  return db.createTable('ELECTION_TOPIC', {
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
    electionGuid: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'ELECTION_TOPIC_electionGuid_ELECTION_guid_fk',
        table: 'ELECTION',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'guid'
      }
    },
    topicGuid: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'ELECTION_TOPIC_topicGuid_TOPIC_guid_fk',
        table: 'TOPIC',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'guid'
      }
    },
    electionTopicStatus: {
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
  return db.dropTable('ELECTION_TOPIC', {}, cb);
};

exports._meta = {
  'version': 1
};
