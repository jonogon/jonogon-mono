import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface PetitionAttachments {
  attachment: string;
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  filename: string;
  id: Generated<Int8>;
  is_image: Generated<boolean>;
  petition_id: Int8;
  thumbnail: string | null;
  title: string | null;
  updated_at: Generated<Timestamp>;
}

export interface Petitions {
  approved_at: Timestamp | null;
  created_at: Generated<Timestamp>;
  created_by: Int8;
  description: string | null;
  formalized_at: Timestamp | null;
  formalized_by: Int8 | null;
  id: Generated<Int8>;
  location: string | null;
  moderated_by: Int8 | null;
  rejected_at: Timestamp | null;
  rejection_reason: string | null;
  submitted_at: Timestamp | null;
  target: string | null;
  title: string | null;
  updated_at: Generated<Timestamp>;
}

export interface PetitionVotes {
  created_at: Generated<Timestamp>;
  id: Generated<Int8>;
  nullified_at: Timestamp | null;
  petition_id: Int8;
  updated_at: Generated<Timestamp>;
  user_id: Int8;
  vote: number;
}

export interface Pgmigrations {
  id: Generated<number>;
  name: string;
  run_on: Timestamp;
}

export interface Users {
  created_at: Generated<Timestamp>;
  encrypted_phone_number: string;
  id: Generated<Int8>;
  is_admin: Generated<boolean | null>;
  is_mod: Generated<boolean | null>;
  name: string | null;
  phone_number_encryption_iv: string;
  phone_number_encryption_key_salt: string;
  phone_number_hmac: string;
  picture: string | null;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  petition_attachments: PetitionAttachments;
  petition_votes: PetitionVotes;
  petitions: Petitions;
  pgmigrations: Pgmigrations;
  users: Users;
}
