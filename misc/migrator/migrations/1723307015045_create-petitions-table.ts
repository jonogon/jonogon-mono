import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'petitions',
        {
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
            formalized_at: {
                type: 'timestamp',
            },
            formalized_by: {
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
        },
        {
            ifNotExists: true,
        },
    );

    pgm.createIndex('petitions', ['created_by'], {
        name: 'petitions__by_user',
        ifNotExists: true,
    });

    pgm.createIndex('petitions', ['formalized_at'], {
        name: 'petitions_formalized',
        ifNotExists: true,
    });

    pgm.createIndex('petitions', ['approved_at'], {
        name: 'petitions_approved',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petitions', [], {
        name: 'petitions__by_user',
        ifExists: true,
    });

    pgm.dropIndex('petitions', [], {
        name: 'petitions_formalized',
        ifExists: true,
    });

    pgm.dropIndex('petitions', [], {
        name: 'petitions_approved',
        ifExists: true,
    });

    pgm.dropTable('petitions', {
        ifExists: true,
    });
}
