import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn(
    'petitions',
    {
      log_score: {
        type: 'double precision',
        default: 0,
        notNull: true,
      },
    },
    {ifNotExists: true},
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('petitions', 'log_score');
}
