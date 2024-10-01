import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        'activity',
        {
            id: {
                type: 'bigserial',
                primaryKey: true,
            },
            interested_object_owner_user_id: {
                type: 'bigint',
                notNull: true,
            },
            activity_object_owner_user_id: {
                type: 'bigint',
            },
            event_type: {
                type: 'varchar',
            },
            interested_object_id: {
                type: 'bigint',
            },
            activity_object_id: {
                type: 'bigint',
            },
            meta: {
                type: 'jsonb',
            },
            created_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('current_timestamp'),
            },
        },
        {
            ifNotExists: true,
        },
    );

    pgm.createIndex(
        'activity',
        [
            'created_at',
            'interested_object_owner_user_id',
            'event_type',
            'interested_object_id',
        ],
        {
            name: 'activity__by-time-interested_object-event_type-object_id',
            ifNotExists: true,
        },
    );

    pgm.createIndex('activity', ['event_type', 'activity_object_id'], {
        name: 'activity__by-event_type-activity_object_id',
        ifNotExists: true,
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('activity', [], {
        name: 'activity__by-event_type-activity_object_id',
        ifExists: true,
    });

    pgm.dropIndex('activity', [], {
        name: 'activity__by-time-interested_object-event_type-object_id',
        ifExists: true,
    });

    pgm.dropTable('activity', {
        ifExists: true,
    });
}
