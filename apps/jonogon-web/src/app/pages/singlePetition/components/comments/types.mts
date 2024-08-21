export interface Comment {
    id: string;
    body: string | null;
    depth: string;
    is_deleted: boolean | null;
    is_highlighted: boolean | null;
    username: string | null;
    user_id: string | null;
    parent_id: string | null;
    total_votes: number;
}

export interface NestedComment extends Comment {
    children?: NestedComment[];
}

export interface InputProps {
    parentId: string | undefined;
    refetch: () => void;
}
