import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('petitions', {
        id: {
            type: 'bigserial',
            primaryKey: true,
        },
        title: {
            type: 'varchar(256)',
        },
        description: {
            type: 'text',
        },
        target: {
            type: 'varchar(256)',
        },
        location: {
            type: 'varchar(256)',
        },
        promoted_at: {
            type: 'timestamp',
        },
        promoted_by: {
            type: 'bigint',
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
        moderated_by: {
            type: 'bigint',
        },
        submitted_at: {
            type: 'timestamp',
        },
        created_by: {
            type: 'bigint',
            notNull: true,
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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('petitions');
}
