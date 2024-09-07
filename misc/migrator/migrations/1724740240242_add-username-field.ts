import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn('users', {
        username: {
            type: 'varchar(256)',
            unique: true,
            notNull: false,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('users', 'username');
}
