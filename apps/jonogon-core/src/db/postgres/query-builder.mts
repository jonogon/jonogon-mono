import type pg from 'pg';
import {Kysely, PostgresDialect} from 'kysely';
import {DB} from './types.mjs';

export function createPostgresQueryBuilder(pool: pg.Pool) {
    const dialect = new PostgresDialect({
        pool,
    });

    return new Kysely<DB>({
        dialect,
    });
}
