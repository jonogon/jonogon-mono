import InputBox from './InputBox';
import Reply from './Reply';
import {GoReply} from 'react-icons/go';
import {AiOutlineLike, AiFillLike} from 'react-icons/ai';
import {useEffect, useRef, useState} from 'react';
import {GoTriangleUp, GoTriangleDown} from 'react-icons/go';
import {CommentInterface, NestedCommentInterface} from './types';
import {trpc} from '@/trpc/client';
import {useParams} from 'next/navigation';

interface CommentProps {
    data: CommentInterface;
}

export default function Comment({data}: CommentProps) {
    const [inputOpened, setInputOpened] = useState(false);
    const [replyInputOpened, setReplyInputOpened] = useState(false);
    const [replyBtnSignal, setReplyBtnSignal] = useState(false); // dis some weird hacking to do dependencyp-inversion-ish magic lol
    const [repliesHiiden, setRepliesHidden] = useState(false);

    const [focusTag, setFocusTag] = useState('');
    const [liked, setLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);

    const likeMutation = trpc.comments.vote.useMutation();
    const unlikeMutation = trpc.comments.clearVote.useMutation();

    const likeComment = () => {
        likeMutation.mutate({
            comment_id: data.id,
            vote: 'up',
        });
        setLiked(true);
        setTotalLikes(totalLikes + 1);
    };
    const unlikeComment = () => {
        unlikeMutation.mutate({
            comment_id: data.id,
        });
        setLiked(false);
        setTotalLikes(totalLikes - 1);
    };

    useEffect(() => {
        setLiked(!!data.user_vote);
        setTotalLikes(data.total_votes);
    }, []);

    const [page, setPage] = useState(1);
    const {id: petition_id} = useParams<{id: string}>();

    const [replyList, setReplyList] = useState<CommentInterface[]>([]);
    const {data: replies, refetch: refetchReplies} =
        trpc.comments.listReplies.useQuery({
            petition_id: petition_id,
            parent_id: data.id,
            page: page,
        });

    useEffect(() => {
        const forbiddenIds = optimisticReplies.map((r) => r.id);
        const newReplyList = replies?.data.filter((r) => {
            return !forbiddenIds.includes(r.id);
        });
        if (newReplyList?.length) {
            setReplyList([...replyList, ...newReplyList]);
        }
    }, [replies]);

    // increment page and load more replies
    const incrementPage = async () => {
        setPage(page + 1);
        await refetchReplies();
    };

    const {data: replyCount} = trpc.comments.countReplies.useQuery({
        petition_id: petition_id,
        parent_id: data.id,
    });

    const [optimisticReplies, setOptimisticReplies] = useState<
        CommentInterface[]
    >([]);

    const appendToOptimistic = (reply: CommentInterface) => {
        setOptimisticReplies([...optimisticReplies, reply]);
    };

    return (
        <div className="flex flex-col my-2 p-2 gap-1">
            <div className="flex flex-row gap-1 items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 border mt-1">
                    <img
                        src={(
                            data.profile_picture ??
                            `https://static.jonogon.org/placeholder-images/${((Number(data.created_by) + 1) % 11) + 1}.jpg`
                        ).replace('$CORE_HOSTNAME', window.location.hostname)}
                        className="rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    {data.username ? (
                        <>
                            <p>{data.username}</p>
                            <p className="text-xs text-stone-500 ml-1">
                                Jonogon-User-{data.created_by}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="ml-1">
                                Jonogon-User-{data.created_by}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <p className="">{data.body}</p>
            <div className="flex flex-row text-sm justify-between items-center">
                <div className="flex flex-row gap-2">
                    <p>{totalLikes} likes</p>
                    <p>{replyCount?.data.count ?? 0} replies</p>
                </div>
                <div className="flex flex-row gap-3 items-center justify-center h-full">
                    {liked ? (
                        <p
                            className="flex flex-row gap-1 items-center cursor-pointer"
                            onClick={() => {
                                unlikeComment();
                            }}>
                            <AiFillLike size={16} />
                            Liked
                        </p>
                    ) : (
                        <p
                            className="flex flex-row gap-1 items-center cursor-pointer"
                            onClick={() => {
                                likeComment();
                            }}>
                            <AiOutlineLike size={16} />
                            Like
                        </p>
                    )}

                    <p
                        className="flex flex-row gap-1 items-center cursor-pointer"
                        onClick={() => {
                            setInputOpened(true);
                            setReplyBtnSignal(!replyBtnSignal);
                        }}>
                        <GoReply />
                        Reply
                    </p>
                    {repliesHiiden ? (
                        <>
                            {!!replyList?.length && (
                                <p
                                    className="flex flex-row items-center cursor-pointer"
                                    onClick={() => {
                                        setRepliesHidden(false);
                                    }}>
                                    <GoTriangleDown size={24} />
                                    Show
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            {!!replyList?.length && (
                                <p
                                    className="flex flex-row items-center cursor-pointer"
                                    onClick={() => {
                                        setRepliesHidden(true);
                                    }}>
                                    <GoTriangleUp size={24} />
                                    Hide
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
            {inputOpened && (
                <div>
                    <InputBox
                        replyBtnSignal={replyBtnSignal}
                        setInputOpened={setInputOpened}
                        parentId={data.id}
                        tag={
                            data.username
                                ? `@${data.username} `
                                : `@Jonogon-User-${data.created_by} `
                        }
                        optimisticSetter={appendToOptimistic}
                    />
                </div>
            )}

            <div>
                {!repliesHiiden && (
                    <div className="ml-3 pl-6 mt-2 border-l">
                        {replyList.map((reply) => (
                            <Reply
                                key={reply.id}
                                setInputOpen={setReplyInputOpened}
                                replyBtnSignal={replyBtnSignal}
                                setReplyBtnSignal={setReplyBtnSignal}
                                setFocusTag={setFocusTag}
                                data={reply}
                            />
                        ))}

                        {!!(
                            replyList.length <
                            Number(replyCount?.data?.count ?? 0)
                        ) && (
                            <p
                                className="font-bold text-sm my-3 cursor-pointer"
                                onClick={() => {
                                    incrementPage();
                                }}>
                                Load more replies
                            </p>
                        )}

                        {optimisticReplies.map((reply) => (
                            <Reply
                                key={reply.id}
                                setInputOpen={setReplyInputOpened}
                                replyBtnSignal={replyBtnSignal}
                                setReplyBtnSignal={setReplyBtnSignal}
                                setFocusTag={setFocusTag}
                                data={reply}
                            />
                        ))}
                    </div>
                )}

                <div>
                    {replyInputOpened && (
                        <InputBox
                            setInputOpened={setReplyInputOpened}
                            replyBtnSignal={replyBtnSignal}
                            parentId={data.id}
                            tag={focusTag}
                            optimisticSetter={appendToOptimistic}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
