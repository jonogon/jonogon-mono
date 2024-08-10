import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('petition_requests', {
        id: {
            type: 'bigserial',
            primaryKey: true,
        },
        user_id: {
            type: 'bigint',
            notNull: true,
        },
        title: {
            type: 'text',
        },
        description: {
            type: 'text',
        },
        target: {
            type: 'text',
        },
        location: {
            type: 'text',
        },
        approved_at: {
            type: 'timestamp',
        },
        rejected_at: {
            type: 'timestamp',
        },
        rejection_reason: {
            type: 'text',
        },
        submitted_at: {
            type: 'timestamp',
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
        _denormalized__upvote_count: {
            type: 'bigint',
            default: 0,
        },
        _denormalized__downvote_count: {
            type: 'bigint',
            default: 0,
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('petition_requests');
}
