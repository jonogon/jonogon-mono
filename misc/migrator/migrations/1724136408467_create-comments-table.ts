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
            created_by: {
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
            deleted_by: {
                type: 'bigint',
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
            highlighted_at: {
                type: 'timestamp',
            },
            deleted_at: {
                type: 'timestamp',
            },
        },
        {
            ifNotExists: true,
        },
    );

    pgm.createIndex('comments', ['petition_id'], {
        name: 'comments__by_petition',
        ifNotExists: true,
    });

    pgm.createIndex('comments', ['parent_id'], {
        name: 'comments__by_parent_comment',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('comments', [], {
        name: 'comments__by_petition',
        ifExists: true,
    });

    pgm.dropIndex('comments', [], {
        name: 'comments__by_parent_comment',
        ifExists: true,
    });

    pgm.dropTable('comments', {
        ifExists: true,
    });
}
