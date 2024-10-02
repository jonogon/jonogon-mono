import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'notifications',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            user_id: {
                type: 'bigint',
                notNull: true,
            },
            type: {
                type: 'varchar',
            },
            actor_user_id: {
                type: 'bigint',
            },
            petition_id: {
                type: 'bigint',
            },
            vote_id: {
                type: 'bigint',
            },
            comment_id: {
                type: 'bigint',
            },
            reply_comment_id: {
                type: 'bigint',
            },
            comment_vote_id: {
                type: 'bigint',
            },
            meta: {
                type: 'jsonb',
            },
            created_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('current_timestamp'),
            },
        },
        {
            ifNotExists: true,
        },
    );

    pgm.createIndex('notifications', ['created_at', 'user_id', 'type'], {
        name: 'notifications__by-created_at-user_id-type',
        ifNotExists: true,
    });

    pgm.createIndex('notifications', ['actor_user_id'], {
        name: 'notifications__by-actor_user_id',
        ifNotExists: true,
    });

    pgm.createIndex('notifications', ['petition_id'], {
        name: 'notifications__by-petition_id',
        ifNotExists: true,
    });

    pgm.createIndex('notifications', ['vote_id'], {
        name: 'notifications__by-vote_id',
        ifNotExists: true,
    });

    pgm.createIndex('notifications', ['comment_id'], {
        name: 'notifications__by-comment_id',
        ifNotExists: true,
    });

    pgm.createIndex('notifications', ['reply_comment_id'], {
        name: 'notifications__by-reply_comment_id',
        ifNotExists: true,
    });

    pgm.createIndex('notifications', ['comment_vote_id'], {
        name: 'notifications__by-comment_vote_id',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-comment_vote_id',
        ifExists: true,
    });

    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-reply_id',
        ifExists: true,
    });

    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-comment_id',
        ifExists: true,
    });

    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-vote_id',
        ifExists: true,
    });

    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-petition_id',
        ifExists: true,
    });

    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-actor_user_id',
        ifExists: true,
    });

    pgm.dropIndex('notifications', [], {
        name: 'notifications__by-created_at-user_id-type',
        ifExists: true,
    });

    pgm.dropTable('notifications', {
        ifExists: true,
    });
}
