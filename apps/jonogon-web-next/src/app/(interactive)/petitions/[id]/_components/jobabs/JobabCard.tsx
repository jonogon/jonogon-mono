import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {
    ThumbsUp,
    MessageCircle,
    Check,
    FileIcon,
    Reply,
    Trash,
} from 'lucide-react';
import {useAuthState} from '@/auth/token-manager';
import {trpc} from '@/trpc/client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {Dialog, DialogContent} from '@/components/ui/dialog';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useToast} from '@/components/ui/use-toast';
import RespondentHoverCard from '@/components/custom/RespondentHoverCard';
import {
    JobabInterface,
    JobabSourceType,
    JobabListItem,
    JobabAttachment,
} from './types';
import {useRelativeTime} from '@/lib/useRelativeTime';
import {formatFullDateTime} from '@/lib/date';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import JobabComments from './JobabComments';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Comment = {
    id: number;
    body: string;
    username: string;
    user_id: string;
    profile_picture: string | null;
    total_votes: number;
    user_vote: number | null;
    created_by: string;
    parent_id: number | null;
    highlighted_at: string | null;
    deleted_at: string | null;
    created_at: string;
};

type JobabCardProps = {
    id: number;
    petition_id: number;
    respondent_id: number;
    title: string | null;
    description: string | null;
    source_type: JobabSourceType;
    source_url: string | null;
    responded_at: string;
    created_at: string;
    vote_count: number;
    user_vote: number | null;
    attachments: JobabAttachment[];
};

export default function JobabCard({
    id,
    title,
    description,
    source_type,
    source_url,
    responded_at,
    created_at,
    vote_count,
    user_vote,
    attachments,
    respondent_id,
}: JobabCardProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [showAllComments, setShowAllComments] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 20;
    const router = useRouter();
    const {toast} = useToast();

    const {data: respondentData} = trpc.respondents.get.useQuery(
        {
            id: respondent_id.toString(),
        },
        {
            enabled: !!respondent_id,
        },
    );

    const respondent = respondentData?.data;

    const sourceTypeLabels: Record<JobabSourceType, string> = {
        jonogon_direct: 'Jonogon Direct',
        news_article: 'News Article',
        official_document: 'Official Document',
        social_media: 'Social Media',
        press_release: 'Press Release',
    };

    const isAuthenticated = useAuthState();

    const {data: selfDataResponse, isFetching} = trpc.users.getSelf.useQuery(
        undefined,
        {
            enabled: !!isAuthenticated,
        },
    );

    const imageAttachments = attachments.filter((a) => a.type === 'image');
    const fileAttachments = attachments.filter((a) => a.type === 'file');

    const [voted, setVoted] = useState(!!user_vote);
    const [totalVotes, setTotalVotes] = useState(vote_count);

    const utils = trpc.useUtils();
    const voteMutation = trpc.jobabs.vote.useMutation({
        onMutate: () => {
            setVoted(true);
            setTotalVotes((prev) => prev + 1);
        },
        onError: () => {
            setVoted(false);
            setTotalVotes((prev) => prev - 1);
        },
        onSuccess: () => {
            const petitionId = Number(window.location.pathname.split('/')[2]);
            utils.jobabs.list.invalidate({
                petition_id: petitionId,
                limit: 10,
                offset: 0,
            });
        },
    });

    const clearVoteMutation = trpc.jobabs.clearVote.useMutation({
        onMutate: () => {
            setVoted(false);
            setTotalVotes((prev) => prev - 1);
        },
        onError: () => {
            setVoted(true);
            setTotalVotes((prev) => prev + 1);
        },
        onSuccess: () => {
            const petitionId = Number(window.location.pathname.split('/')[2]);
            utils.jobabs.list.invalidate({
                petition_id: petitionId,
                limit: 10,
                offset: 0,
            });
        },
    });

    const {data: commentsData, refetch: refetchComments} =
        trpc.jobabs.listComments.useQuery(
            {
                jobab_id: id,
                page: currentPage,
                limit: showAllComments ? COMMENTS_PER_PAGE : 3,
            },
            {
                enabled: true,
                keepPreviousData: true,
            },
        );

    const {data: commentCountData} = trpc.jobabs.countRootComments.useQuery(
        {
            jobab_id: id,
        },
        {
            enabled: true,
        },
    );

    const createCommentMutation = trpc.jobabs.createComment.useMutation({
        onSuccess: () => {
            setCommentText('');
            setReplyText('');
            setReplyingTo(null);
            utils.jobabs.listComments.invalidate({jobab_id: id});
            utils.jobabs.countRootComments.invalidate({jobab_id: id});
            toast({
                title: '💬 Comment Posted',
                description: 'Your comment has been posted successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to post comment',
                variant: 'destructive',
            });
        },
    });

    const commentVoteMutation = trpc.jobabs.commentVote.useMutation({
        onSuccess: () => {
            utils.jobabs.listComments.invalidate({jobab_id: id});
            toast({
                title: '👍🏽 Comment Vote',
                description: 'Your vote has been recorded successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update vote',
                variant: 'destructive',
            });
        },
    });

    const clearCommentVoteMutation = trpc.jobabs.clearCommentVote.useMutation({
        onSuccess: () => {
            utils.jobabs.listComments.invalidate({jobab_id: id});
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update vote',
                variant: 'destructive',
            });
        },
    });

    const redirectToLoginPage = () => {
        const nextUrl = encodeURIComponent(window.location.pathname);
        router.push(`/login?next=${nextUrl}`);
    };

    const voteJobab = async () => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        try {
            if (voted) {
                await clearVoteMutation.mutateAsync({
                    jobab_id: id,
                });
                toast({
                    title: '👎🏽 Removed Vote',
                    description: 'You have successfully removed your vote',
                });
            } else {
                await voteMutation.mutateAsync({
                    jobab_id: id,
                    vote: 'up',
                });
                toast({
                    title: '👍🏽 Upvoted জবাব',
                    description: 'You have successfully upvoted the জবাব',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update vote',
                variant: 'destructive',
            });
        }
    };

    const handleCommentSubmit = async () => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        if (!commentText.trim()) return;

        try {
            await createCommentMutation.mutateAsync({
                jobab_id: id,
                body: commentText.trim(),
            });
        } catch (error) {
            // Error is handled in onError callback
        }
    };

    const handleReplySubmit = async (parentId: number) => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        if (!replyText.trim()) return;

        try {
            await createCommentMutation.mutateAsync({
                jobab_id: Number(id),
                parent_id: Number(parentId),
                body: replyText.trim(),
            });
        } catch (error) {
            // Error is handled in onError callback
        }
    };

    const handleCommentVote = async (commentId: number, hasVoted: boolean) => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        try {
            if (hasVoted) {
                await clearCommentVoteMutation.mutateAsync({
                    comment_id: Number(commentId),
                });
            } else {
                await commentVoteMutation.mutateAsync({
                    comment_id: Number(commentId),
                    vote: 'up',
                });
            }
        } catch (error) {
            // Error is handled in onError callbacks
        }
    };

    const handleViewAllComments = () => {
        setShowAllComments(true);
        setCurrentPage(1);
    };

    useEffect(() => {
        setTotalVotes(vote_count);
    }, [vote_count]);

    const [allComments, setAllComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (commentsData?.data) {
            if (currentPage === 1) {
                setAllComments(commentsData.data as unknown as Comment[]);
            } else {
                setAllComments((prev) => {
                    const newComments =
                        commentsData.data as unknown as Comment[];
                    const uniqueComments = newComments.filter(
                        (newComment) =>
                            !prev.some(
                                (existingComment) =>
                                    existingComment.id === newComment.id,
                            ),
                    );
                    return [...prev, ...uniqueComments];
                });
            }
        }
    }, [commentsData?.data, currentPage]);

    const respondedTime = useRelativeTime(responded_at);
    const fullDateTime = formatFullDateTime(responded_at);

    return (
        <div className="flex gap-3">
            <div className="w-1 bg-red-500 rounded-full" />
            <div className="flex-1 space-y-4">
                {/* Jobab Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <RespondentHoverCard respondent={respondent}>
                            <Avatar className="h-12 w-12 cursor-pointer">
                                <AvatarImage
                                    className="border-4 rounded-full w-12 h-12"
                                    src={(
                                        respondent?.img_url ??
                                        `https://static.jonogon.org/placeholder-images/${((Number(respondent?.id ?? 0) + 1) % 11) + 1}.jpg`
                                    ).replace(
                                        '$CORE_HOSTNAME',
                                        window.location.hostname,
                                    )}
                                    alt={respondent?.name ?? 'Respondent'}
                                />
                                <AvatarFallback>
                                    <div className="bg-border rounded-full animate-pulse h-12 w-12"></div>
                                </AvatarFallback>
                            </Avatar>
                        </RespondentHoverCard>
                        <div className="space-y-1">
                            <RespondentHoverCard respondent={respondent}>
                                <p className="font-semibold text-base flex items-center gap-2">
                                    {respondent?.name}
                                </p>
                            </RespondentHoverCard>
                            <p className="text-sm text-muted-foreground space-x-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="cursor-default">
                                                {respondedTime}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{fullDateTime}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {source_type && (
                                    <>
                                        <span className="text-muted-foreground">
                                            |
                                        </span>
                                        <span>
                                            {sourceTypeLabels[source_type]}
                                        </span>
                                    </>
                                )}
                                {source_url && (
                                    <>
                                        <span className="text-muted-foreground">
                                            |
                                        </span>
                                        <a
                                            href={source_url}
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                            Source
                                        </a>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 border rounded-md border-green-500 bg-green-50 text-green-700 text-sm flex items-center gap-2 shadow-sm">
                        <span className="font-medium">
                            {respondent?.type === 'organization'
                                ? 'Official'
                                : 'Expert'}
                        </span>
                        <div className="bg-green-500 rounded-full p-0.5">
                            <Check className="w-3.5 h-3.5 text-green-100" />
                        </div>
                    </div>
                </div>

                {/* Jobab Content */}
                <div className="space-y-4">
                    {title && (
                        <h4 className="text-xl font-semibold text-foreground">
                            {title}
                        </h4>
                    )}
                    {description && (
                        <p className="text-base leading-relaxed text-neutral-700">
                            {description}
                        </p>
                    )}
                    {fileAttachments.length > 0 && (
                        <div className="space-y-2.5">
                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                <FileIcon className="w-4 h-4" />
                                Attached Files
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {fileAttachments.map((file) => (
                                    <a
                                        key={file.id}
                                        href={file.url.replace(
                                            '$CORE_HOSTNAME',
                                            window.location.hostname,
                                        )}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-lg shadow-sm transition-all text-sm group">
                                        <div className="p-1 bg-neutral-100 rounded">
                                            <FileIcon className="w-3.5 h-3.5 text-neutral-500" />
                                        </div>
                                        <span className="font-medium text-neutral-700 text-sm">
                                            {file.filename}
                                        </span>
                                        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full uppercase">
                                            {file.filename.split('.').pop()}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Carousel */}
                {imageAttachments.length > 0 && (
                    <div className="relative w-full">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {imageAttachments.map((image) => (
                                    <CarouselItem key={image.id}>
                                        <img
                                            src={image.url.replace(
                                                '$CORE_HOSTNAME',
                                                window.location.hostname,
                                            )}
                                            alt={image.filename}
                                            className="w-full h-64 object-cover rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                            onClick={() =>
                                                setSelectedImage(
                                                    image.url.replace(
                                                        '$CORE_HOSTNAME',
                                                        window.location
                                                            .hostname,
                                                    ),
                                                )
                                            }
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {imageAttachments.length > 1 && (
                                <>
                                    <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2" />
                                    <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2" />
                                </>
                            )}
                        </Carousel>
                    </div>
                )}

                {/* Interactions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                voted
                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                    : 'hover:bg-neutral-100 text-neutral-600'
                            }`}
                            onClick={voteJobab}>
                            <ThumbsUp
                                className={`w-5 h-5 transition-transform ${voted ? 'scale-110' : ''}`}
                                fill={voted ? 'currentColor' : 'none'}
                            />
                            <span className="font-medium">{totalVotes}</span>
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-neutral-100 text-neutral-600`}>
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">
                                {(commentCountData?.data.count ?? 0) > 0
                                    ? `${commentCountData?.data.count} Comments`
                                    : 'Comments'}
                            </span>
                        </button>
                    </div>
                    {(commentCountData?.data.count ?? 0) > 3 && (
                        <Button
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                                setShowAllComments(!showAllComments);
                                if (!showAllComments) {
                                    setCurrentPage(1);
                                }
                            }}>
                            {showAllComments
                                ? 'Hide comments'
                                : `View all comments`}
                        </Button>
                    )}
                </div>

                {/* Comment Input */}
                {isAuthenticated && (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage
                                className="border-4 rounded-full w-10 h-10"
                                src={(
                                    selfDataResponse?.data.picture_url ??
                                    `https://static.jonogon.org/placeholder-images/${((Number(selfDataResponse?.data.id ?? 0) + 1) % 11) + 1}.jpg`
                                ).replace(
                                    '$CORE_HOSTNAME',
                                    window.location.hostname,
                                )}
                            />
                            <AvatarFallback>
                                <div className="bg-border rounded-full animate-pulse h-10 w-10"></div>
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50 hover:bg-white transition-colors"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCommentSubmit();
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Comments List */}
                {commentsData?.data && (
                    <JobabComments
                        comments={
                            showAllComments
                                ? allComments
                                : (commentsData.data as unknown as Comment[])
                        }
                        totalComments={commentCountData?.data.count}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        onVote={handleCommentVote}
                        onReply={setReplyingTo}
                        replyingTo={replyingTo}
                        selfData={selfDataResponse?.data}
                        replyText={replyText}
                        onReplyTextChange={setReplyText}
                        onReplySubmit={handleReplySubmit}
                        showAllComments={showAllComments}
                        commentsPerPage={COMMENTS_PER_PAGE}
                        isAuthenticated={!!isAuthenticated}
                    />
                )}

                {/* Image Modal */}
                <Dialog
                    open={!!selectedImage}
                    onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="max-w-[95vw] max-h-[95vh] w-fit h-fit p-0">
                        <img
                            src={selectedImage ?? ''}
                            alt="Full screen view"
                            className="w-auto h-auto max-w-full max-h-[95vh] object-contain"
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
