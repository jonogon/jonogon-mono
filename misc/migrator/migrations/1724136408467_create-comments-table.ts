import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'comments',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            parent_id: {
                type: 'bigint',
            },
            petition_id: {
                type: 'bigint',
                notNull: true,
            },
            user_id: {
                type: 'bigint',
                notNull: true,
            },
            body: {
                type: 'text',
            },
            depth: {
                type: 'bigint',
                notNull: true,
            },
            is_deleted: {
                type: 'boolean',
                default: false,
            },
            deleted_by: {
                type: 'bigint',
            },
            is_highlighted: {
                type: 'boolean',
                default: false,
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
            deleted_at: {
                type: 'timestamp',
            },
        },
        {
            ifNotExists: true,
        },
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('comments', {
        ifExists: true,
    });
}
