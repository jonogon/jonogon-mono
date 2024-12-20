import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Add jobab_id to notifications table
    pgm.addColumn('notifications', {
        jobab_id: {
            type: 'bigint',
            references: 'jobabs(id)',
            onDelete: 'CASCADE',
        },
    });

    // Add index for better performance
    pgm.createIndex('notifications', ['jobab_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    // Remove index first
    pgm.dropIndex('notifications', ['jobab_id']);

    // Remove column
    pgm.dropColumn('notifications', ['jobab_id']);
}
