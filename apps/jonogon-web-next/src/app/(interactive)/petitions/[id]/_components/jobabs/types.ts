export type JobabSourceType =
    | 'jonogon_direct'
    | 'news_article'
    | 'official_document'
    | 'social_media'
    | 'press_release';

export interface JobabAttachment {
    id: number;
    filename: string;
    type: 'image' | 'file';
    url: string;
}

export interface JobabRespondent {
    id: number;
    name: string;
    type: 'organization' | 'expert';
    img_url: string | null;
    social_accounts?: SocialAccount[];
}

export interface JobabInterface {
    id: number;
    title: string | null;
    description: string | null;
    source_type: JobabSourceType;
    source_url: string | null;
    responded_at: string;
    created_at: string;
    vote_count: number;
    user_vote: number | null;
    attachments: JobabAttachment[];
    respondent: JobabRespondent | null;
}

export interface JobabFormData {
    title: string;
    description: string;
    respondentId: string;
    sourceType: JobabSourceType;
    sourceUrl: string;
    respondedAt: Date;
}

export interface JobabFormErrors {
    title?: string;
    description?: string;
    respondentId?: string;
    sourceType?: string;
    sourceUrl?: string;
    respondedAt?: string;
}

export type JobabVoteType = 'up' | 'down';

export interface JobabVote {
    id: number;
    jobab_id: number;
    user_id: number;
    vote_type: JobabVoteType;
    created_at: string;
    updated_at: string;
}

export interface JobabVoteResponse {
    success: boolean;
    message?: string;
    data?: JobabVote;
}

export interface JobabListItem {
    id: string;
    petition_id: string;
    respondent_id: string;
    title: string | null;
    description: string | null;
    source_type: JobabSourceType;
    source_url: string | null;
    responded_at: string;
    created_at: string;
    attachments?: Array<{
        id: string;
        filename: string;
        url: string;
    }>;
    vote_count: number;
    user_vote: number | null;
}

export interface SocialNetworkConfig {
    readonly name: string;
    readonly icon: string;
    readonly baseUrl: string;
    readonly usernamePattern: RegExp;
}

export const SOCIAL_NETWORKS: Record<string, SocialNetworkConfig> = {
    facebook: {
        name: 'Facebook',
        icon: 'facebook',
        baseUrl: 'https://facebook.com/',
        usernamePattern: /^[a-zA-Z0-9.]+$/,
    },
    instagram: {
        name: 'Instagram',
        icon: 'instagram',
        baseUrl: 'https://instagram.com/',
        usernamePattern: /^[a-zA-Z0-9._]+$/,
    },
    twitter: {
        name: 'X (Twitter)',
        icon: 'twitter',
        baseUrl: 'https://x.com/',
        usernamePattern: /^[a-zA-Z0-9_]+$/,
    },
    linkedin: {
        name: 'LinkedIn',
        icon: 'linkedin',
        baseUrl: 'https://linkedin.com/in/',
        usernamePattern: /^[a-zA-Z0-9-]+$/,
    },
    youtube: {
        name: 'YouTube',
        icon: 'youtube',
        baseUrl: 'https://youtube.com/@',
        usernamePattern: /^[a-zA-Z0-9-_]+$/,
    },
} as const;

export type SocialNetwork = keyof typeof SOCIAL_NETWORKS;

export interface SocialAccount {
    platform: SocialNetwork;
    username: string;
    url: string;
}

export interface JobabsResponse {
    data: JobabListItem[];
}
