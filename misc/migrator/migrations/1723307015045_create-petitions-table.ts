import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('petitions', {
        id: {
            type: 'bigserial',
            primaryKey: true,
        },
        user_id: {
            type: 'bigint',
            notNull: true,
        },
        title: {
            type: 'text',
        },
        description: {
            type: 'text',
        },
        target: {
            type: 'text',
        },
        location: {
            type: 'text',
        },
        approved_at: {
            type: 'timestamp',
        },
        rejected_at: {
            type: 'timestamp',
        },
        rejection_reason: {
            type: 'text',
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
        _denormalized__vote_count: {
            type: 'bigint',
            default: 0,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('petitions');
}
