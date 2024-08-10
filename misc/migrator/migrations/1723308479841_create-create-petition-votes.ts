import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('petition_votes', {
        id: {
            type: 'bigserial',
            primaryKey: true,
        },
        petition_request_id: {
            type: 'bigint',
            notNull: true,
        },
        user_id: {
            type: 'bigint',
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
    });

    pgm.createIndex('petition_votes', ['petition_request_id', 'user_id'], {
        unique: true,
        name: 'petition_votes__by_user_on_petition_request',
    });

    pgm.createIndex('petition_votes', ['petition_request_id'], {
        unique: true,
        name: 'petition_votes__by_petition',
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petition_votes', [], {
        name: 'petition_votes__by_user_on_petition_request',
    });

    pgm.dropIndex('petition_votes', [], {
        name: 'petition_votes__by_petition',
    });

    pgm.dropTable('petition_votes');
}
