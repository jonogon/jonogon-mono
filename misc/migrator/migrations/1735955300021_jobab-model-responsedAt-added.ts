import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn('jobabs', {
        responded_at: {
            type: 'timestamp',
            notNull: false,
            default: null,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('jobabs', 'responded_at');
}
