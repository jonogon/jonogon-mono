import {useEffect, useState} from 'react';
import Comment from './Comment';
import RootInputBox from './RootInputBox';
import {trpc} from '@/trpc';
import {useParams} from 'next/navigation';
import {CommentTreeInterface, NestedCommentInterface} from './types';

export default function CommentThread() {
    const [commentTree, setCommentTree] = useState<NestedCommentInterface[]>();

    const {id: petition_id} = useParams<{id: string}>();

    const {data: comments, refetch: refetchComments} =
        trpc.comments.list.useQuery({
            petition_id: petition_id,
        });

    const {data: replies, refetch: refetchReplies} =
        trpc.comments.list.useQuery({
            petition_id: petition_id,
            parent_id: '-1',
        });

    const refetch = async () => {
        await refetchComments();
        await refetchReplies();
    };

    useEffect(() => {
        const tree = comments?.data.reduce((map, comment) => {
            map[comment.id] = {
                ...comment,
                children: [],
            };
            return map;
        }, {} as CommentTreeInterface);

        replies?.data.map((reply) => {
            if (tree) {
                const parent = tree[reply.parent_id ?? ''];
                parent.children?.push(reply);
            }
        });

        const commentTree = Object.values(tree ?? {});
        const sortedCommentTree = commentTree.sort(
            (a, b) => b.total_votes - a.total_votes,
        );

        setCommentTree(sortedCommentTree);
    }, [comments, replies]);

    return (
        <div className="mt-8">
            <p className="font-bold">{comments?.data.length} comments</p>
            <RootInputBox refetch={refetch} />
            <div>
                {commentTree?.map((comment) => {
                    return (
                        <Comment
                            data={comment}
                            key={comment.id}
                            refetch={refetch}
                        />
                    );
                })}
            </div>
        </div>
    );
}
