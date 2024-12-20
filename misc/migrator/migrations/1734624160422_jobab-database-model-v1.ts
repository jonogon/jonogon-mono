import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // Create Respondents table
    pgm.createTable('respondents', {
        id: { type: 'bigserial', primaryKey: true },
        type: { type: 'text', notNull: true },
        name: { type: 'text', notNull: true },
        img: { type: 'text' },
        bio: { type: 'text' },
        website: { type: 'text' },
        created_by: { type: 'bigint', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        deleted_at: { type: 'timestamp' }
    });

    // Create SocialAccounts table
    pgm.createTable('social_accounts', {
        id: { type: 'bigserial', primaryKey: true },
        respondent_id: { type: 'bigint', notNull: true, references: 'respondents(id)' },
        platform: { type: 'text', notNull: true },
        username: { type: 'text', notNull: true },
        url: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    });

    // Create Jobabs table
    pgm.createTable('jobabs', {
        id: { type: 'bigserial', primaryKey: true },
        petition_id: { type: 'bigint', notNull: true },
        respondent_id: { type: 'bigint', notNull: true },
        title: { type: 'text' },
        description: { type: 'text' },
        source_type: { type: 'text', notNull: true },
        source_url: { type: 'text' },
        created_by: { type: 'bigint', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        deleted_at: { type: 'timestamp' }
    });

    // Create JobabAttachments table
    pgm.createTable('jobab_attachments', {
        id: { type: 'bigserial', primaryKey: true },
        jobab_id: { type: 'bigint', notNull: true, references: 'jobabs(id)' },
        filename: { type: 'text', notNull: true },
        attachment: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        deleted_at: { type: 'timestamp' }
    });

    // Create JobabVotes table
    pgm.createTable('jobab_votes', {
        id: { type: 'bigserial', primaryKey: true },
        jobab_id: { type: 'bigint', notNull: true, references: 'jobabs(id)' },
        user_id: { type: 'bigint', notNull: true },
        vote: { type: 'integer', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        nullified_at: { type: 'timestamp' }
    });

    // Create JobabComments table
    pgm.createTable('jobab_comments', {
        id: { type: 'bigserial', primaryKey: true },
        jobab_id: { type: 'bigint', notNull: true, references: 'jobabs(id)' },
        parent_id: { type: 'bigint', references: 'jobab_comments(id)' },
        body: { type: 'text', notNull: true },
        created_by: { type: 'bigint', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        deleted_at: { type: 'timestamp' },
        highlighted_at: { type: 'timestamp' }
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('jobab_comments');
    pgm.dropTable('jobab_votes');
    pgm.dropTable('jobab_attachments');
    pgm.dropTable('jobabs');
    pgm.dropTable('social_accounts');
    pgm.dropTable('respondents');
}
