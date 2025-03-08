import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('andolon', {
    id: { type: 'bigserial', primaryKey: true },
    name: { type: 'text', notNull: true },
    image_url: { type: 'text', notNull: false },
    status: { type: 'text', notNull: false },
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
    deleted_at: { type: 'timestamp' },
  });
  pgm.addColumns(
    'petitions',
    {
      andolon_id: {
        type: 'bigint',
        references: 'andolon(id)',
        onDelete: 'SET NULL',
      },
    },
    {
      ifNotExists: true,
    },
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('petitions', ['andolon_id']);
  pgm.dropTable('andolon');
}
