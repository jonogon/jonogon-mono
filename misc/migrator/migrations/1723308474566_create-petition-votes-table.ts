import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'petition_votes',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            petition_id: {
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

    pgm.createIndex('petition_votes', ['petition_id', 'user_id'], {
        unique: true,
        name: 'petition_votes__by_user_on_petition',
        ifNotExists: true,
    });

    pgm.createIndex('petition_votes', ['petition_id'], {
        unique: true,
        name: 'petition_votes__by_petition',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petition_request_votes', [], {
        name: 'petition_votes__by_user_on_petition',
        ifExists: true,
    });

    pgm.dropIndex('petition_request_votes', [], {
        name: 'petition_votes__by_petition',
        ifExists: true,
    });

    pgm.dropTable('petition_votes', {
        ifExists: true,
    });
}
