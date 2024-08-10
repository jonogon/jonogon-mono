import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'users',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            name: {
                type: 'varchar(256)',
            },
            picture: {
                type: 'varchar(512)',
            },
            is_mod: {
                type: 'boolean',
                default: false,
            },
            is_admin: {
                type: 'boolean',
                default: false,
            },
            phone_number_hmac: {
                type: 'varchar(64)',
                unique: true,
                notNull: true,
            },
            encrypted_phone_number: {
                type: 'varchar(256)',
                notNull: true,
            },
            phone_number_encryption_key_salt: {
                type: 'varchar(64)',
                notNull: true,
            },
            phone_number_encryption_iv: {
                type: 'varchar(64)',
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

    pgm.createIndex('users', ['phone_number_hmac'], {
        name: 'users__by_phone_number_hmac',
        ifNotExists: true,
    });

    pgm.createIndex('users', ['is_mod'], {
        name: 'users_mods',
        ifNotExists: true,
    });

    pgm.createIndex('users', ['is_admin'], {
        name: 'users_admins',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('users', ['is_admin'], {
        name: 'users_admins',
        ifExists: true,
    });

    pgm.dropIndex('users', ['is_mod'], {
        name: 'users_mods',
        ifExists: true,
    });

    pgm.dropIndex('users', ['phone_number_hmac'], {
        name: 'users__by_phone_number_hmac',
        ifExists: true,
    });

    pgm.dropTable('users', {
        ifExists: true,
    });
}
