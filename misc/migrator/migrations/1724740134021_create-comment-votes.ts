import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'comment_votes',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            comment_id: {
                type: 'bigint',
                notNull: true,
            },
            user_id: {
                type: 'bigint',
                notNull: true,
            },
            vote: {
                type: 'smallint',
                notNull: true,
            },
            nullified_at: {
                type: 'timestamp',
            },
            created_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('current_timestamp'),
            },
            updated_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('current_timestamp'),
            },
        },
        {
            ifNotExists: true,
        },
    );

    pgm.createConstraint('comment_votes', 'comment_votes__by_user_on_comment', {
        unique: ['comment_id', 'user_id'],
        ifExists: false,
    });

    pgm.createIndex('comment_votes', ['comment_id'], {
        name: 'comment_votes__by_comment',
        ifNotExists: true,
    });

    pgm.createIndex('comment_votes', ['comment_id', 'vote'], {
        name: 'comment_votes__by_vote_type',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint('comment_votes', 'comment_votes__by_user_on_comment', {
        ifExists: true,
    });

    pgm.dropIndex('comment_votes', [], {
        name: 'comment_votes__by_comment',
        ifExists: true,
    });

    pgm.dropIndex('comment_votes', [], {
        name: 'comment_votes__by_vote_type',
        ifExists: true,
    });

    pgm.dropTable('comment_votes', {
        ifExists: true,
    });
}
