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
  db.createTable('VOTE', {
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
    electionGuid: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'VOTE_electionGuid_ELECTION_guid_fk',
        table: 'ELECTION',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'guid'
      }
    },
    candidateGuid: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'VOTE_candidateGuid_CANDIDATE_guid_fk',
        table: 'CANDIDATE',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'guid'
      }
    },
    voterGuid: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'VOTE_voterGuid_VOTER_guid_fk',
        table: 'VOTER',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'guid'
      }
    },
    voteStatus: {
      type: 'string',
      notNull: true,
      defaultValue: 'VALID'
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
  db.dropTable('VOTE', {}, cb);
};

exports._meta = {
  'version': 1
};
