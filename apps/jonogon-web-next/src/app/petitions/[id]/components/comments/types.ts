import {RefObject} from 'react';

export interface Comment {
    user_id: string | null;
    username: string | null;

    id: string;
    parent_id: string | null;
    body: string | null;
    depth: string;

    deleted_at: string | null;
    highlighted_at: string | null;

    total_votes: number;
    user_vote: number | null;
}

export interface NestedComment extends Comment {
    children?: NestedComment[];
}

export interface InputProps {
    refetch: () => void;
    inputRef: RefObject<HTMLInputElement>;
    focusedCommentId: string;
    setFocusedCommentId: (x: string) => void;
}

export interface CommentThreadProps {
    comments: NestedComment[];
    refetch: () => void;
    inputRef: RefObject<HTMLInputElement>;
    focusedCommentId: string;
    setFocusedCommentId: (x: string) => void;
}

export interface CommentProps {
    comment: NestedComment;
    refetch: () => void;
    inputRef: RefObject<HTMLInputElement>;
    focusedCommentId: string;
    setFocusedCommentId: (x: string) => void;
}
