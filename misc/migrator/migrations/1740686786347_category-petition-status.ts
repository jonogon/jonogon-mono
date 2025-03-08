import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('categories', {
    id: { type: 'bigserial', primaryKey: true },
    name: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamp' }
  });
  pgm.addColumns('petitions', {
    hold_at: { type: 'timestamp' },
    hold_reason: { type: 'text', notNull: false },
    category_id: { type: 'bigint', references: 'categories(id)', onDelete: 'SET NULL' }
  }, {
    ifNotExists: true
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns('petitions', ['hold_at', 'hold_reason', 'category_id']);
  pgm.dropTable('categories');
}
