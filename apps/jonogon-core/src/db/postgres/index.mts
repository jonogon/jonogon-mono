import pg from 'pg';
import {env} from '../../env.mjs';

export async function createPostgresPool(options?: {
    connectionString?: string;
}) {
    return options?.connectionString
        ? new pg.Pool({
              connectionString: options.connectionString,
          })
        : new pg.Pool({
              connectionString: env.DATABASE_URL,
          });
}
