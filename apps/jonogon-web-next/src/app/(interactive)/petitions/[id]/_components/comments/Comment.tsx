import InputBox from './InputBox';
import Reply from './Reply';
import {GoReply} from 'react-icons/go';
import {AiOutlineLike, AiFillLike} from 'react-icons/ai';
import {useEffect, useRef, useState} from 'react';
import {GoTriangleUp, GoTriangleDown} from 'react-icons/go';
import {CommentInterface, NestedCommentInterface} from './types';
import {trpc} from '@/trpc/client';
import {useParams} from 'next/navigation';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {MoreVertical} from 'lucide-react';
import {MdDelete} from 'react-icons/md';
import {useAuthState} from '@/auth/token-manager';

interface CommentProps {
    data: CommentInterface;
    selfId: number;
    selfDestruct: (id: string) => void;
}

export default function Comment({data, selfId, selfDestruct}: CommentProps) {
    const isAuthenticated = useAuthState();

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
    const {data: replies, refetch: refetchReplies} = isAuthenticated
        ? trpc.comments.listReplies.useQuery({
              petition_id: petition_id,
              parent_id: data.id,
              page: page,
          })
        : trpc.comments.listPublicReplies.useQuery({
              petition_id: petition_id,
              parent_id: data.id,
              page: page,
          });

    useEffect(() => {
        const forbiddenIds = optimisticReplies.map((r) => r.id);
        const existingIds = replyList.map((r) => r.id);

        const newReplyList = replies?.data.filter((r) => {
            return ![...forbiddenIds, ...existingIds].includes(r.id);
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

    const [totalReplies, setTotalReplies] = useState(0);

    useEffect(() => {
        setTotalReplies(Number(replyCount?.data.count ?? 0));
    }, [replyCount]);

    const [optimisticReplies, setOptimisticReplies] = useState<
        CommentInterface[]
    >([]);

    const appendToOptimistic = (reply: CommentInterface) => {
        setOptimisticReplies([...optimisticReplies, reply]);
        setTotalReplies(totalReplies + 1);
    };

    const [deleteOpened, setDeleteOpened] = useState(false);

    const handleRemoved = (id: string) => {
        setReplyList(replyList.filter((r) => r.id != id));
        setOptimisticReplies(optimisticReplies.filter((r) => r.id != id));
        setTotalReplies(totalReplies - 1);
    };

    const {mutateAsync: deleteComment} = trpc.comments.delete.useMutation();

    return (
        <div className="flex flex-col my-2 p-2 gap-1">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-1 items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 border mt-1">
                        <img
                            src={(
                                data.profile_picture ??
                                `https://static.jonogon.org/placeholder-images/${((Number(data.created_by) + 1) % 11) + 1}.jpg`
                            ).replace(
                                '$CORE_HOSTNAME',
                                window.location.hostname,
                            )}
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        {data.username ? (
                            <>
                                <p>{data.username}</p>
                                <p className="text-xs text-stone-500 ml-1">
                                    Citizen #{data.created_by}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="ml-1">
                                    Citizen #{data.created_by}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    {isAuthenticated && selfId == Number(data.created_by) && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0 mt-4">
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <div
                                            className="flex flex-row gap-1 items-center"
                                            onClick={() =>
                                                setDeleteOpened(true)
                                            }>
                                            <MdDelete />
                                            Delete Comment
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialog
                                open={deleteOpened}
                                onOpenChange={setDeleteOpened}>
                                <AlertDialogTrigger
                                    asChild></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your
                                            comment.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel
                                            onClick={() => {
                                                setDeleteOpened(false);
                                            }}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={async () => {
                                                await deleteComment({
                                                    id: Number(data.id),
                                                });
                                                selfDestruct(data.id);
                                            }}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                    <div></div>
                </div>
            </div>

            <p className="">{data.body}</p>
            <div className="flex flex-row text-sm justify-between items-center">
                <div className="flex flex-row gap-2">
                    <p>{totalLikes} likes</p>
                    <p>{totalReplies} replies</p>
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
                                : `@Citizen #${data.created_by} `
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
                                selfId={selfId}
                                selfDestruct={handleRemoved}
                            />
                        ))}

                        {!!(
                            replyList.length <
                            totalReplies - optimisticReplies.length
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
                                selfId={selfId}
                                selfDestruct={handleRemoved}
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
