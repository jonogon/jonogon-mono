import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Add the deleted_at column for soft deletion
    pgm.addColumn('petitions', {
        deleted_at: {
            type: 'timestamp',
            notNull: false, // Allow null for soft deletion
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    // Remove the deleted_at column if rolling back
    pgm.dropColumn('petitions', 'deleted_at');
}
