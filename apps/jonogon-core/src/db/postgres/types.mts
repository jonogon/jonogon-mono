import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface PetitionRequests {
  _denormalized__downvote_count: Generated<Int8 | null>;
  _denormalized__upvote_count: Generated<Int8 | null>;
  approved_at: Timestamp | null;
  created_at: Generated<Timestamp>;
  description: string | null;
  id: Generated<Int8>;
  location: string | null;
  rejected_at: Timestamp | null;
  rejection_reason: string | null;
  target: string | null;
  title: string | null;
  updated_at: Generated<Timestamp>;
  user_id: Int8;
}

export interface PetitionRequestVotes {
  created_at: Generated<Timestamp>;
  id: Generated<Int8>;
  nullified_at: Timestamp | null;
  petition_request_id: Int8;
  updated_at: Generated<Timestamp>;
  user_id: Int8;
  vote: number;
}

export interface Petitions {
  _denormalized__vote_count: Generated<Int8 | null>;
  approved_at: Timestamp | null;
  created_at: Generated<Timestamp>;
  description: string | null;
  id: Generated<Int8>;
  location: string | null;
  rejected_at: Timestamp | null;
  rejection_reason: string | null;
  target: string | null;
  title: string | null;
  updated_at: Generated<Timestamp>;
  user_id: Int8;
}

export interface PetitionVotes {
  created_at: Generated<Timestamp>;
  id: Generated<Int8>;
  nullified_at: Timestamp | null;
  petition_request_id: Int8;
  updated_at: Generated<Timestamp>;
  user_id: Int8;
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
  name: string | null;
  phone_number_encryption_iv: string;
  phone_number_encryption_key_salt: string;
  phone_number_hmac: string;
  picture: string | null;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  petition_request_votes: PetitionRequestVotes;
  petition_requests: PetitionRequests;
  petition_votes: PetitionVotes;
  petitions: Petitions;
  pgmigrations: Pgmigrations;
  users: Users;
}
