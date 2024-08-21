import {useEffect, useState} from 'react';
import {NestedComment} from './types.js';
import {useParams} from 'next/navigation';
import {trpc} from '@/trpc';
import InputBox from '@/components/custom/single-petition/comments/InputBox';
import Comment from '@/components/custom/single-petition/comments/Comment';

export const treeify = (comments: NestedComment[]): NestedComment[] => {
    // Time complexity is O(3n) I think
    const entries = comments.map((comment) => [
        comment.id,
        {...comment, children: []},
    ]);
    const commentMap = Object.fromEntries(entries);

    const addCommentsToMap = (comment: NestedComment) => {
        if (comment.parent_id) {
            commentMap[comment.parent_id].children.push(commentMap[comment.id]);
        }
    };

    comments.map(addCommentsToMap);

    const addCommentsToRoot = (comment: NestedComment) => {
        if (!comment.parent_id) {
            return commentMap[comment.id];
        }
    };

    const rootComments = comments.map(addCommentsToRoot);

    return rootComments.filter((comment) => {
        return !!comment;
    });
};

export default function CommentThread() {
    const {petition_id} = useParams() as {petition_id: string};
    const {data, refetch} = trpc.comments.list.useQuery({
        petition_id: petition_id,
    });

    const [comments, setComments] = useState<NestedComment[]>([]);

    useEffect(() => {
        const nestedComments = treeify(data?.data ?? []);
        setComments(nestedComments?.length ? nestedComments : []);
    }, [data]);

    return (
        <>
            <div>
                <InputBox parentId={undefined} refetch={refetch} />
                {comments.map((comment) => {
                    return <Comment comment={comment} refetch={refetch} />;
                })}
            </div>
        </>
    );
}