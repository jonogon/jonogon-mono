import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Pgmigrations {
  id: Generated<number>;
  name: string;
  run_on: Timestamp;
}

export interface Users {
  created_at: Generated<Timestamp>;
  encrypted_phone_number: string;
  id: Generated<number>;
  name: string | null;
  phone_number_encryption_iv: string;
  phone_number_encryption_key_salt: string;
  phone_number_hmac: string;
  picture: string | null;
  updated_at: Timestamp;
}

export interface DB {
  pgmigrations: Pgmigrations;
  users: Users;
}
