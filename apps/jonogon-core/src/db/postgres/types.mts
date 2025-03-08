import type {ColumnType} from 'kysely';

export type Generated<T> =
    T extends ColumnType<infer S, infer I, infer U>
        ? ColumnType<S, I | undefined, U>
        : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<
    string,
    bigint | number | string,
    bigint | number | string
>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
    [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Comments {
    body: string | null;
    created_at: Generated<Timestamp>;
    created_by: Int8;
    deleted_at: Timestamp | null;
    deleted_by: Int8 | null;
    depth: Int8;
    highlighted_at: Timestamp | null;
    id: Generated<Int8>;
    parent_id: Int8 | null;
    petition_id: Int8;
    updated_at: Generated<Timestamp>;
}

export interface CommentVotes {
    comment_id: Int8;
    created_at: Generated<Timestamp>;
    id: Generated<Int8>;
    nullified_at: Timestamp | null;
    updated_at: Generated<Timestamp>;
    user_id: Int8;
    vote: number;
}

export interface Notifications {
    actor_user_id: Int8 | null;
    comment_id: Int8 | null;
    comment_vote_id: Int8 | null;
    created_at: Generated<Timestamp>;
    id: Generated<Int8>;
    meta: Json | null;
    petition_id: Int8 | null;
    jobab_id: Int8 | null;
    reply_comment_id: Int8 | null;
    type: string;
    user_id: Int8;
    vote_id: Int8 | null;
}

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
    deleted_at: Timestamp | null;
    description: string | null;
    formalized_at: Timestamp | null;
    formalized_by: Int8 | null;
    id: Generated<Int8>;
    location: string | null;
    moderated_by: Int8 | null;
    rejected_at: Timestamp | null;
    rejection_reason: string | null;
    flagged_at: Timestamp | null;
    flagged_reason: string | null;
    hold_at: Timestamp | null;
    hold_reason: string | null;
    submitted_at: Timestamp | null;
    target: string | null;
    title: string | null;
    updated_at: Generated<Timestamp>;
    upvote_target: number | null;
    category_id: Int8 | null;
    andolon_id: Int8 | null;
    score: number;
    log_score: number;
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

export interface Category {
    id: Generated<Int8>;
    name: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
}

export interface Andolon {
    id: Generated<Int8>;
    name: string;
    image_url: string | null;
    status: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
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
    username: string | null;
}

export interface Respondents {
    id: Generated<Int8>;
    type: 'organization' | 'expert';
    name: string;
    img: string | null;
    bio: string | null;
    website: string | null;
    created_by: Int8;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
}

export interface SocialAccounts {
    id: Generated<Int8>;
    respondent_id: Int8;
    platform: string; // e.g. 'twitter', 'facebook', 'linkedin', etc.
    username: string;
    url: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
}

export interface Jobabs {
    id: Generated<Int8>;
    petition_id: Int8;
    respondent_id: Int8;
    title: string | null;
    description: string | null;
    source_type:
        | 'jonogon_direct'
        | 'news_article'
        | 'official_document'
        | 'social_media'
        | 'press_release';
    source_url: string | null;
    responded_at: Generated<Timestamp>;
    created_by: Int8; // moderator who created it
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
}

export interface JobabAttachments {
    id: Generated<Int8>;
    jobab_id: Int8;
    filename: string;
    attachment: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
}

export interface JobabVotes {
    id: Generated<Int8>;
    jobab_id: Int8;
    user_id: Int8;
    vote: number; // 1 for upvote, -1 for downvote
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    nullified_at: Timestamp | null;
}

export interface JobabComments {
    id: Generated<Int8>;
    jobab_id: Int8;
    parent_id: Int8 | null; // for nested comments
    body: string;
    created_by: Int8;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    highlighted_at: Timestamp | null;
}

export interface JobabCommentVotes {
    id: Generated<Int8>;
    comment_id: Int8;
    user_id: Int8;
    vote: number; // 1 for upvote, -1 for downvote
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
}

export interface DB {
    comment_votes: CommentVotes;
    comments: Comments;
    notifications: Notifications;
    petition_attachments: PetitionAttachments;
    petition_votes: PetitionVotes;
    petitions: Petitions;
    pgmigrations: Pgmigrations;
    users: Users;
    respondents: Respondents;
    social_accounts: SocialAccounts;
    jobabs: Jobabs;
    jobab_attachments: JobabAttachments;
    jobab_votes: JobabVotes;
    jobab_comments: JobabComments;
    jobab_comment_votes: JobabCommentVotes;
    categories: Category,
    andolon: Andolon,
}
