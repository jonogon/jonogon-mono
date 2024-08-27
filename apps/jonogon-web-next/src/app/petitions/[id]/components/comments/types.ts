export interface CommentInterface {
    id: string;
    total_votes: number;
    created_by: string;
    body: string | null;
    deleted_at: string | null;
    highlighted_at: string | null;
    username: string | null;
    user_id: string;
    user_vote: number | null;
    profile_picture: string | null;
}

export interface NestedCommentInterface extends CommentInterface {
    children?: CommentInterface[];
}

export interface CommentTreeInterface {
    [id: string]: NestedCommentInterface;
}
