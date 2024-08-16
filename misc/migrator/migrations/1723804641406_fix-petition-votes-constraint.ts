import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('petition_request_votes', [], {
        name: 'petition_votes__by_user_on_petition',
        ifExists: true,
    });

    pgm.createConstraint(
        'petition_votes',
        'petition_votes__by_user_on_petition',
        {
            unique: ['petition_id', 'user_id'],
            ifExists: false,
        },
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint(
        'petition_votes',
        'petition_votes__by_user_on_petition',
        {
            ifExists: true,
        },
    );

    pgm.createIndex('petition_votes', ['petition_id', 'user_id'], {
        unique: true,
        name: 'petition_votes__by_user_on_petition',
        ifNotExists: true,
    });
}
