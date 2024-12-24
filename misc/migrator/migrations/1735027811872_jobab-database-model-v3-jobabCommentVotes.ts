import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Create JobabCommentVotes table
    pgm.createTable('jobab_comment_votes', {
        id: {
            type: 'bigserial',
            primaryKey: true,
        },
        comment_id: {
            type: 'bigint',
            notNull: true,
            references: 'jobab_comments(id)',
            onDelete: 'CASCADE',
        },
        user_id: {
            type: 'bigint',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        vote: {
            type: 'integer',
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
    });

    // Add unique constraint to prevent multiple votes from same user on same comment
    pgm.addConstraint(
        'jobab_comment_votes',
        'jobab_comment_votes__by_user_on_comment',
        {
            unique: ['user_id', 'comment_id'],
        },
    );

    // Add indexes for better performance
    pgm.createIndex('jobab_comment_votes', ['comment_id']);
    pgm.createIndex('jobab_comment_votes', ['user_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    // Drop indexes first
    pgm.dropIndex('jobab_comment_votes', ['comment_id']);
    pgm.dropIndex('jobab_comment_votes', ['user_id']);

    // Drop table (will automatically drop constraints)
    pgm.dropTable('jobab_comment_votes');
}
