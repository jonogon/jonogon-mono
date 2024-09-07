import {useEffect, useState} from 'react';
import Comment from './Comment';
import RootInputBox from './RootInputBox';
import {trpc} from '@/trpc/client';
import {useParams, useRouter} from 'next/navigation';
import {
    CommentInterface,
    CommentTreeInterface,
    NestedCommentInterface,
} from './types';
import {useAuthState} from '@/auth/token-manager';

export default function CommentThread() {
    const isAuthenticated = useAuthState();
    const {data: selfDataResponse} = trpc.users.getSelf.useQuery(undefined, {
        enabled: !!isAuthenticated,
    });
    const selfUserId = parseInt(`${selfDataResponse?.data.id ?? '0'}`);

    const [commentList, setCommentList] = useState<CommentInterface[]>([]);

    const [page, setPage] = useState(1);

    const {id: petition_id} = useParams<{id: string}>();

    const {data: comments, refetch: refetchComments} =
        trpc.comments.list.useQuery({
            petition_id: petition_id,
            page: page,
        });

    const {data: commentCount} = trpc.comments.count.useQuery({
        petition_id: petition_id,
    });

    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        setTotalComments(Number(commentCount?.data.count ?? 0));
    }, [commentCount]);

    const router = useRouter();

    // append to the list of comments everytime more comments are loaded
    useEffect(() => {
        console.log(comments, 'comments rn');
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
        setTotalComments(totalComments + 1);
    };

    const handleRemoved = (id: string) => {
        setCommentList(commentList.filter((c) => c.id != id));
        setOptimisticComments(optimisticComments.filter((c) => c.id != id));
        setTotalComments(totalComments - 1);
    };

    return (
        <div className="mt-8">
            <p className="font-bold">{totalComments} comments</p>
            {isAuthenticated ? (
                <RootInputBox
                    refetch={refetchComments}
                    optimisticSetter={appendToOptimistic}
                />
            ) : (
                <p className="my-4">
                    <span
                        className="text-blue underline cursor-pointer text-blue-500"
                        onClick={() => {
                            const next = `/petitions/${petition_id}`;
                            router.push(
                                `/login?next=${encodeURIComponent(next)}`,
                            );
                        }}>
                        Login
                    </span>{' '}
                    to leave comments
                </p>
            )}

            <div>
                {optimisticComments?.map((comment) => {
                    return (
                        <Comment
                            key={comment.id}
                            data={comment}
                            selfId={selfUserId}
                            selfDestruct={handleRemoved}
                        />
                    );
                })}
                {commentList?.map((comment) => {
                    return (
                        <Comment
                            key={comment.id}
                            data={comment}
                            selfId={selfUserId}
                            selfDestruct={handleRemoved}
                        />
                    );
                })}
                {!!(
                    isAuthenticated &&
                    commentList.length <
                        totalComments - optimisticComments.length
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
