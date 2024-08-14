import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'petition_attachments',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            petition_id: {
                type: 'bigint',
                notNull: true,
            },
            is_image: {
                type: 'boolean',
                notNull: true,
                default: false,
            },
            title: {
                type: 'varchar(256)',
            },
            filename: {
                type: 'varchar(256)',
                notNull: true,
            },
            thumbnail: {
                type: 'varchar(512)',
            },
            attachment: {
                type: 'varchar(512)',
                notNull: true,
            },
            deleted_at: {
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

    pgm.createIndex('petition_attachments', ['petition_id'], {
        unique: true,
        name: 'petition_attachments__by_petition',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petition_attachments', [], {
        name: 'petition_attachments__by_petition',
        ifExists: true,
    });

    pgm.dropTable('petition_attachments', {
        ifExists: true,
    });
}
