import pg from 'pg';

export async function createPostgresPool(options?: {
    connectionString?: string;
}) {
    return options?.connectionString
        ? new pg.Pool({
              connectionString: options.connectionString,
          })
        : new pg.Pool();
}
