import {useEffect, useState} from 'react';
import {CommentProps, NestedComment} from './types.js';
import InputBox from './InputBox';
import {trpc} from '@/trpc';
import {RiThumbUpFill, RiThumbUpLine} from 'react-icons/ri';

export default function Comment({
    comment,
    refetch,
    inputRef,
    focusedCommentId,
    setFocusedCommentId,
}: CommentProps) {
    const [comments, setComments] = useState<NestedComment[]>(
        comment.children ?? [],
    );

    const [inputOpened, setInputOpened] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);
    const [childrenExpanded, setChildrenExpanded] = useState(false);
    const [liked, setLiked] = useState(false);

    const {mutateAsync: addLike} = trpc.comments.vote.useMutation();
    const {mutateAsync: removeLike} = trpc.comments.clearVote.useMutation();

    useEffect(() => {
        setComments(comment?.children ?? []);
        setTotalVotes(comment?.total_votes ?? 0);

        if (comment.user_vote) {
            setLiked(true);
        }
    }, [comment]);

    const likeComment = () => {
        setLiked(true);
        addLike({
            comment_id: comment.id,
            vote: 'up',
        });
        setTotalVotes(totalVotes + 1);
    };

    const unlikeComment = () => {
        setLiked(false);
        removeLike({
            comment_id: comment.id,
        });
        setTotalVotes(totalVotes - 1);
    };

    const focusInput = () => {
        setFocusedCommentId(comment.id);
        inputRef.current?.focus();
    };

    return (
        <div className="">
            <div className="flex flex-row relative">
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 absolute left-2 top-4"></div>
                <div
                    className={`w-full bg-white mt-2 rounded-lg ${focusedCommentId == comment.id ? 'border-2 border-blue-500' : ''}`}>
                    <div className="p-4">
                        <div className="ml-10 flex flex-row justify-between">
                            <p className="font-semibold">
                                {comment.username ??
                                    `Jonogon-User-${comment.user_id}`}
                            </p>
                            {liked ? (
                                <div className="flex flex-row gap-2 items-end">
                                    <p className="text-sm font-semibold text-black">
                                        {totalVotes}
                                    </p>
                                    <RiThumbUpFill
                                        className="cursor-pointer"
                                        size={24}
                                        onClick={unlikeComment}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-row gap-2 items-end">
                                    <p className="text-sm font-semibold text-stone-500">
                                        {totalVotes}
                                    </p>
                                    <RiThumbUpLine
                                        className="cursor-pointer"
                                        size={24}
                                        onClick={likeComment}
                                    />
                                </div>
                            )}
                        </div>

                        <p className="mt-4">{comment?.body}</p>
                    </div>

                    {Number(comment.depth) < 2 && (
                        <div className="border-t px-4 py-2">
                            {childrenExpanded ? (
                                <div className="flex justify-between">
                                    <p
                                        className="cursor-pointer font-semibold"
                                        onClick={() => {
                                            setChildrenExpanded(false);
                                        }}>
                                        Hide {comments.length} Replies
                                    </p>
                                    <p
                                        className="cursor-pointer font-semibold"
                                        onClick={focusInput}>
                                        Reply
                                    </p>
                                </div>
                            ) : (
                                <div className="flex justify-between">
                                    {Number(comment.depth) < 2 &&
                                    comments.length ? (
                                        <>
                                            <p
                                                className="cursor-pointer font-semibold"
                                                onClick={() => {
                                                    setChildrenExpanded(true);
                                                }}>
                                                {comments.length} Replies
                                            </p>
                                            <p
                                                className="cursor-pointer font-semibold"
                                                onClick={focusInput}>
                                                Reply
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p></p>
                                            <p
                                                className="cursor-pointer font-semibold"
                                                onClick={focusInput}>
                                                Reply
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {Number(comment.depth) < 2 && childrenExpanded && (
                <div className="flex flex-row">
                    <div className="border-l h-auto ml-3"></div>
                    <div className="w-full">
                        {comments?.map((c) => {
                            return (
                                <div className="ml-4 flex flex-col" key={c.id}>
                                    <Comment
                                        comment={c}
                                        refetch={refetch}
                                        inputRef={inputRef}
                                        focusedCommentId={focusedCommentId}
                                        setFocusedCommentId={
                                            setFocusedCommentId
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
