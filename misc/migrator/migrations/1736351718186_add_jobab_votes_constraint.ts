import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Add check constraint for vote values
    pgm.addConstraint('jobab_votes', 'jobab_votes_vote_check', {
        check: 'vote IN (-1, 1)',
        ifExists: false,
    });

    // Add unique constraint
    pgm.addConstraint('jobab_votes', 'jobab_votes__by_user_on_jobab', {
        unique: ['jobab_id', 'user_id'],
        ifExists: false,
    });

    // Add foreign key constraints
    pgm.addConstraint('jobab_votes', 'fk_jobab_votes_jobab', {
        foreignKeys: {
            columns: ['jobab_id'],
            references: 'jobabs(id)',
            onDelete: 'CASCADE',
        },
    });

    pgm.addConstraint('jobab_votes', 'fk_jobab_votes_user', {
        foreignKeys: {
            columns: ['user_id'],
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
    });

    // Add indexes for better performance
    pgm.createIndex('jobab_votes', ['jobab_id'], {
        name: 'idx_jobab_votes_jobab_id',
        ifNotExists: true,
    });

    pgm.createIndex('jobab_votes', ['user_id'], {
        name: 'idx_jobab_votes_user_id',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    // Drop indexes
    pgm.dropIndex('jobab_votes', ['jobab_id'], {
        name: 'idx_jobab_votes_jobab_id',
        ifExists: true,
    });
    pgm.dropIndex('jobab_votes', ['user_id'], {
        name: 'idx_jobab_votes_user_id',
        ifExists: true,
    });

    // Drop constraints
    pgm.dropConstraint('jobab_votes', 'jobab_votes__by_user_on_jobab', {
        ifExists: true,
    });
    pgm.dropConstraint('jobab_votes', 'fk_jobab_votes_jobab', {
        ifExists: true,
    });
    pgm.dropConstraint('jobab_votes', 'fk_jobab_votes_user', {
        ifExists: true,
    });
    pgm.dropConstraint('jobab_votes', 'jobab_votes_vote_check', {
        ifExists: true,
    });
}
