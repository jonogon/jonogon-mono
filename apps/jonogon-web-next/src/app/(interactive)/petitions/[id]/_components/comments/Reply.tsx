import {AiFillLike, AiOutlineLike} from 'react-icons/ai';
import {GoReply} from 'react-icons/go';
import {CommentInterface} from './types';
import {useEffect, useState} from 'react';
import {trpc} from '@/trpc/client';

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

export default function Reply({
    setInputOpen,
    replyBtnSignal,
    setReplyBtnSignal,
    setFocusTag,
    data,
    selfId,
    selfDestruct,
}: {
    setInputOpen: (x: boolean) => void;
    replyBtnSignal: boolean;
    setReplyBtnSignal: (x: boolean) => void;
    setFocusTag: (x: string) => void;
    data: CommentInterface;
    selfId: number;
    selfDestruct: (id: string) => void;
}) {
    const isAuthenticated = useAuthState();

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

    const [deleteOpened, setDeleteOpened] = useState(false);

    const {mutateAsync: deleteReply} = trpc.comments.delete.useMutation();

    return (
        <div className="flex flex-col gap-1 my-2">
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
                                    <DropdownMenuItem>
                                        <div
                                            className="flex flex-row gap-1 items-center"
                                            onClick={() =>
                                                setDeleteOpened(true)
                                            }>
                                            <MdDelete />
                                            Delete Reply
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
                                            will permanently delete your reply.
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
                                                await deleteReply({
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
                </div>
            </div>

            <p className="">{data.body}</p>
            <div className="flex flex-row text-sm justify-between items-center">
                <div className="flex flex-row gap-2">
                    <p>{totalLikes} likes</p>
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
                            setFocusTag(
                                data.username
                                    ? `@${data.username} `
                                    : `@Citizen #${data.created_by} `,
                            );
                            setInputOpen(true);
                            setReplyBtnSignal(!replyBtnSignal);
                        }}>
                        <GoReply />
                        Reply
                    </p>
                </div>
            </div>
        </div>
    );
}
