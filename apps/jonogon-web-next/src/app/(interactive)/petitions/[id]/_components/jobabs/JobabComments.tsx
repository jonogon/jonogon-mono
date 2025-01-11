import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {ThumbsUp, Reply} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {useRelativeTime} from '@/lib/useRelativeTime';
import {formatFullDateTime} from '@/lib/date';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {useRef, useState} from 'react';
import {JSX} from 'react';

type Comment = {
    id: number;
    body: string;
    username: string;
    user_id: string;
    profile_picture: string | null;
    total_votes: number;
    user_vote: number | null;
    is_author?: boolean;
    created_by: string;
    parent_id: number | null;
    highlighted_at: string | null;
    deleted_at: string | null;
    created_at: string;
};

type CommentWithReplies = Comment & {
    replies?: CommentWithReplies[];
};

function organizeComments(comments: Comment[]): CommentWithReplies[] {
    const commentMap = new Map<number, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // First pass: create all comment objects with their IDs
    comments.forEach((comment) => {
        commentMap.set(comment.id, {...comment, replies: []});
    });

    // Second pass: organize into tree structure
    comments.forEach((comment) => {
        const commentWithReplies = commentMap.get(comment.id)!;
        if (comment.parent_id === null) {
            rootComments.push(commentWithReplies);
        } else {
            const parent = commentMap.get(comment.parent_id);
            if (parent && parent.replies) {
                parent.replies.push(commentWithReplies);
            }
        }
    });

    return rootComments;
}

type JobabCommentsProps = {
    comments: Comment[];
    totalComments?: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    onVote: (commentId: number, hasVoted: boolean) => void;
    onReply: (commentId: number | null) => void;
    replyingTo: number | null;
    selfData?: {
        picture_url: string | null;
        name: string | null;
        id: string | null;
    };
    replyText: string;
    onReplyTextChange: (text: string) => void;
    onReplySubmit: (parentId: number) => void;
    showAllComments: boolean;
    commentsPerPage: number;
    isAuthenticated: boolean;
};

function CommentItem({
    comment,
    depth = 0,
    onVote,
    onReply,
    replyingTo,
    selfData,
    replyText,
    onReplyTextChange,
    onReplySubmit,
    mostRecentCommentId,
    isAuthenticated,
}: {
    comment: CommentWithReplies;
    depth?: number;
    onVote: (commentId: number, hasVoted: boolean) => void;
    onReply: (commentId: number | null) => void;
    replyingTo: number | null;
    selfData?: {
        picture_url: string | null;
        name: string | null;
        id: string | null;
    };
    replyText: string;
    onReplyTextChange: (text: string) => void;
    onReplySubmit: (commentId: number) => void;
    mostRecentCommentId?: number;
    isAuthenticated: boolean;
}): JSX.Element {
    const relativeTime = useRelativeTime(comment.created_at);
    const fullDateTime = formatFullDateTime(comment.created_at);
    const [isVoting, setIsVoting] = useState(false);
    const [showReplies, setShowReplies] = useState(
        comment.id === mostRecentCommentId,
    );
    const commentId = Number(comment.id);
    const replyCount = comment.replies?.length ?? 0;

    const handleVote = async () => {
        if (isVoting) return;
        setIsVoting(true);
        try {
            await onVote(commentId, !!comment.user_vote);
        } finally {
            setIsVoting(false);
        }
    };

    const handleReply = () => {
        onReply(replyingTo === commentId ? null : commentId);
    };

    const handleSubmitReply = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onReplySubmit(commentId);
        }
    };

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                        src={
                            comment.profile_picture ??
                            `https://static.jonogon.org/placeholder-images/${((Number(comment.user_id) + 1) % 11) + 1}.jpg`
                        }
                        alt={comment.username}
                        className="object-cover"
                    />
                    <AvatarFallback>
                        {comment.username.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                            {comment.username}
                        </span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-xs text-neutral-500 cursor-default">
                                        {relativeTime}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{fullDateTime}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-sm text-neutral-700">{comment.body}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <button
                            onClick={handleVote}
                            disabled={isVoting}
                            className={`flex items-center gap-1.5 transition-colors ${
                                isVoting
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:text-neutral-700'
                            } ${comment.user_vote ? 'text-green-600' : ''}`}>
                            <ThumbsUp
                                className={`w-4 h-4 ${comment.user_vote ? 'fill-current' : ''}`}
                            />
                            <span>{comment.total_votes}</span>
                        </button>
                        {depth < 2 && isAuthenticated && (
                            <button
                                onClick={handleReply}
                                className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors">
                                <Reply className="w-4 h-4" />
                                <span>Reply</span>
                            </button>
                        )}
                        {replyCount > 0 && (
                            <button
                                onClick={toggleReplies}
                                className="flex items-center gap-1.5 hover:text-neutral-700 transition-colors">
                                <span>
                                    {replyCount}{' '}
                                    {replyCount === 1 ? 'reply' : 'replies'}
                                </span>
                                <span className="text-xs">•</span>
                                <span>{showReplies ? 'Hide' : 'Show'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {replyingTo === commentId && selfData && (
                <div className="ml-11 mt-2">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage
                                src={
                                    selfData.picture_url ??
                                    `https://static.jonogon.org/placeholder-images/${((Number(selfData.id ?? 0) + 1) % 11) + 1}.jpg`
                                }
                                alt="Your avatar"
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {selfData.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) =>
                                    onReplyTextChange(e.target.value)
                                }
                                placeholder="Write a reply..."
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyDown={handleSubmitReply}
                            />
                        </div>
                    </div>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && showReplies && (
                <div className={`ml-11 space-y-4 ${depth > 0 ? 'mt-4' : ''}`}>
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onVote={onVote}
                            onReply={onReply}
                            replyingTo={replyingTo}
                            selfData={selfData}
                            replyText={replyText}
                            onReplyTextChange={onReplyTextChange}
                            onReplySubmit={onReplySubmit}
                            mostRecentCommentId={mostRecentCommentId}
                            isAuthenticated={isAuthenticated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function JobabComments({
    comments,
    totalComments = 0,
    currentPage,
    setCurrentPage,
    onVote,
    onReply,
    replyingTo,
    selfData,
    replyText,
    onReplyTextChange,
    onReplySubmit,
    showAllComments,
    commentsPerPage,
    isAuthenticated,
}: JobabCommentsProps) {
    const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

    // Find the most recent comment ID
    const mostRecentCommentId =
        comments.length > 0
            ? comments.reduce((latest, current) => {
                  const latestDate = new Date(latest.created_at);
                  const currentDate = new Date(current.created_at);
                  return currentDate > latestDate ? current : latest;
              }).id
            : undefined;

    const handleLoadMore = () => {
        const buttonPosition =
            loadMoreButtonRef.current?.getBoundingClientRect().top;
        const scrollPosition = window.scrollY;

        setCurrentPage(currentPage + 1);

        if (buttonPosition) {
            requestAnimationFrame(() => {
                const newButtonPosition =
                    loadMoreButtonRef.current?.getBoundingClientRect().top;
                if (newButtonPosition) {
                    const offset = newButtonPosition - buttonPosition;
                    window.scrollTo({
                        top: scrollPosition + offset,
                        behavior: 'instant',
                    });
                }
            });
        }
    };

    const organizedComments = organizeComments(comments);

    return (
        <div className="space-y-4">
            {comments.length > 0 && <Separator className="my-4" />}
            {organizedComments.map((comment) => (
                <div key={comment.id}>
                    <CommentItem
                        comment={comment}
                        onVote={onVote}
                        onReply={onReply}
                        replyingTo={replyingTo}
                        selfData={selfData}
                        replyText={replyText}
                        onReplyTextChange={onReplyTextChange}
                        onReplySubmit={onReplySubmit}
                        mostRecentCommentId={mostRecentCommentId}
                        isAuthenticated={isAuthenticated}
                    />
                </div>
            ))}
            {showAllComments &&
                totalComments > commentsPerPage &&
                currentPage * commentsPerPage < totalComments && (
                    <div className="flex justify-center pt-1">
                        <Button
                            ref={loadMoreButtonRef}
                            variant="outline"
                            onClick={handleLoadMore}>
                            Load More Comments
                        </Button>
                    </div>
                )}
        </div>
    );
}
