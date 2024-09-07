import {useEffect, useState} from 'react';
import Comment from './Comment';
import RootInputBox from './RootInputBox';
import {trpc} from '@/trpc/client';
import {useParams} from 'next/navigation';
import {
    CommentInterface,
    CommentTreeInterface,
    NestedCommentInterface,
} from './types';

export default function CommentThread() {
    const [commentList, setCommentList] = useState<CommentInterface[]>([]);

    const [page, setPage] = useState(1);

    const {id: petition_id} = useParams<{id: string}>();

    const {data: comments, refetch: refetchComments} =
        trpc.comments.list.useQuery({
            petition_id: petition_id,
            page: page,
        });

    const {data: totalComments} = trpc.comments.count.useQuery({
        petition_id: petition_id,
    });

    // append to the list of comments everytime more comments are loaded
    useEffect(() => {
        const forbiddenIds = optimisticComments.map((c) => c.id);
        const newCommentsList = comments?.data.filter((c) => {
            return !forbiddenIds.includes(c.id);
        });
        if (newCommentsList?.length) {
            setCommentList([...commentList, ...newCommentsList]);
        }
    }, [comments]);

    // increment page and load more comments
    const incremendPage = async () => {
        setPage(page + 1);
        await refetchComments();
    };

    const [optimisticComments, setOptimisticComments] = useState<
        CommentInterface[]
    >([]);

    const appendToOptimistic = (comment: CommentInterface) => {
        setOptimisticComments([...optimisticComments, comment]);
    };

    return (
        <div className="mt-8">
            <p className="font-bold">
                {Number(totalComments?.data.count ?? 0) +
                    optimisticComments.length}{' '}
                comments
            </p>
            <RootInputBox
                refetch={refetchComments}
                optimisticSetter={appendToOptimistic}
            />
            <div>
                {optimisticComments?.map((comment) => {
                    return <Comment key={comment.id} data={comment} />;
                })}
                {commentList?.map((comment) => {
                    return <Comment key={comment.id} data={comment} />;
                })}
                {!!(
                    commentList.length < Number(totalComments?.data?.count ?? 0)
                ) && (
                    <p
                        className="text-sm font-bold cursor-pointer"
                        onClick={() => {
                            incremendPage();
                        }}>
                        Load more comments
                    </p>
                )}
            </div>
        </div>
    );
}
