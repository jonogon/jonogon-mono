import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petition_attachments', [], {
        name: 'petition_attachments__by_petition',
        ifExists: true,
    });

    pgm.createIndex('petition_attachments', ['petition_id'], {
        name: 'petition_attachments__by_petition',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petition_attachments', [], {
        name: 'petition_attachments__by_petition',
        ifExists: true,
    });

    pgm.createIndex('petition_attachments', ['petition_id'], {
        unique: true,
        name: 'petition_attachments__by_petition',
        ifNotExists: true,
    });
}
