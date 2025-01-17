import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {
    ThumbsUp,
    MessageCircle,
    Check,
    FileIcon,
    Reply,
    Trash,
    SendHorizontal,
    MessageSquare,
    MoreVertical,
    Pencil,
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
    Comment,
} from './types';
import {formatDate, formatFullDate} from '@/lib/date';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import JobabComments from './JobabComments';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type JobabCardProps = JobabInterface & {
    petition_id: number;
    onEdit?: (jobabData: {
        id: number;
        title: string | null;
        description: string | null;
        respondent_id: number;
        source_type: JobabSourceType;
        source_url: string | null;
        responded_at: string;
        attachments: JobabAttachment[];
    }) => void;
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
    created_by,
    petition_id,
    onEdit,
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

    const [userVote, setUserVote] = useState(!!user_vote);
    const [totalVotes, setTotalVotes] = useState(vote_count);
    const [isVoting, setIsVoting] = useState(false);

    const utils = trpc.useUtils();
    const voteMutation = trpc.jobabs.vote.useMutation({
        onMutate: () => {
            setUserVote(true);
            setTotalVotes((prev) => prev + 1);
        },
        onError: () => {
            setUserVote(false);
            setTotalVotes((prev) => prev - 1);
            toast({
                title: 'Error',
                description: 'Failed to update vote',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            const petitionId = Number(window.location.pathname.split('/')[2]);
            utils.jobabs.list.invalidate({
                petition_id: petitionId,
                limit: 10,
                offset: 0,
            });
            toast({
                title: '👍🏽 Upvoted জবাব',
                description: 'You have successfully upvoted the জবাব',
            });
        },
    });

    const clearVoteMutation = trpc.jobabs.clearVote.useMutation({
        onMutate: () => {
            setUserVote(false);
            setTotalVotes((prev) => prev - 1);
        },
        onError: () => {
            setUserVote(true);
            setTotalVotes((prev) => prev + 1);
            toast({
                title: 'Error',
                description: 'Failed to update vote',
                variant: 'destructive',
            });
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

    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

    const deleteCommentMutation = trpc.jobabs.deleteComment.useMutation({
        onSuccess: () => {
            utils.jobabs.listComments.invalidate({jobab_id: id});
            utils.jobabs.countRootComments.invalidate({jobab_id: id});
            toast({
                title: '🗑️ Comment Deleted',
                description: 'Your comment has been deleted successfully',
            });
            setCommentToDelete(null);
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete comment',
                variant: 'destructive',
            });
            setCommentToDelete(null);
        },
    });

    const handleDeleteComment = async (commentId: number) => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        setCommentToDelete(commentId);
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;

        try {
            await deleteCommentMutation.mutateAsync({
                id: commentToDelete,
            });
        } catch (error) {
            // Error is handled in onError callback
        }
    };

    const redirectToLoginPage = () => {
        const nextUrl = encodeURIComponent(window.location.pathname);
        router.push(`/login?next=${nextUrl}`);
    };

    const voteJobab = async () => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        if (isVoting) return;
        setIsVoting(true);

        try {
            if (userVote) {
                await clearVoteMutation.mutateAsync({
                    jobab_id: id,
                });
            } else {
                await voteMutation.mutateAsync({
                    jobab_id: id,
                    vote: 'up',
                });
            }
        } catch (error) {
            // Error is handled in onError callbacks
        } finally {
            setIsVoting(false);
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

    useEffect(() => {
        setUserVote(!!user_vote);
    }, [user_vote]);

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

    const respondedTime = formatDate(new Date(responded_at));
    const fullDateTime = formatFullDate(responded_at);

    const [jobabToDelete, setJobabToDelete] = useState<number | null>(null);

    const softDeleteJobabMutation = trpc.jobabs.softDeleteJobab.useMutation({
        onSuccess: () => {
            toast({
                title: '🗑️ জবাব Deleted',
                description: 'The জবাব has been deleted successfully',
            });
            setJobabToDelete(null);
            // Invalidate the jobabs list query to trigger a refetch
            const petitionId = Number(window.location.pathname.split('/')[2]);
            utils.jobabs.list.invalidate({
                petition_id: petitionId,
                limit: 5,
                offset: 0,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete জবাব',
                variant: 'destructive',
            });
            setJobabToDelete(null);
        },
    });

    const handleDeleteJobab = () => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }
        setJobabToDelete(id);
    };

    const confirmJobabDelete = async () => {
        if (!jobabToDelete) return;

        try {
            await softDeleteJobabMutation.mutateAsync({
                id: jobabToDelete,
            });
        } catch (error) {
            // Error is handled in onError callback
        }
    };

    const canDeleteJobab =
        isAuthenticated &&
        selfDataResponse?.meta.token &&
        (selfDataResponse.meta.token.is_user_admin ||
            selfDataResponse.meta.token.is_user_moderator ||
            selfDataResponse.data.id === created_by);

    const isAdmin = !!selfDataResponse?.meta.token.is_user_admin;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="flex gap-3">
            <div className="w-1 bg-red-500 rounded-full" />
            <div className="flex-1 space-y-4 overflow-hidden">
                {/* Jobab Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <RespondentHoverCard respondent={respondent}>
                            <Avatar className="h-12 w-12 cursor-pointer shrink-0">
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
                        <div className="space-y-1 overflow-hidden">
                            <RespondentHoverCard respondent={respondent}>
                                <p className="font-semibold text-base flex items-center gap-2 break-words">
                                    {respondent?.name}
                                </p>
                            </RespondentHoverCard>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center flex-wrap gap-x-1.5 gap-y-1">
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
                                        <span className="text-muted-foreground text-[10px]">
                                            •
                                        </span>
                                        <span>
                                            {sourceTypeLabels[source_type]}
                                        </span>
                                    </>
                                )}
                                {source_url && (
                                    <>
                                        <span className="text-muted-foreground text-[10px]">
                                            •
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

                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                onEdit?.({
                                                    id,
                                                    title,
                                                    description,
                                                    respondent_id,
                                                    source_type,
                                                    source_url,
                                                    responded_at,
                                                    attachments,
                                                })
                                            }>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit জবাব</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {canDeleteJobab && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={handleDeleteJobab}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete জবাব</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                </div>

                {/* Jobab Content */}
                <div className="space-y-4">
                    {title && (
                        <h4 className="text-xl font-semibold text-foreground break-words">
                            {title}
                        </h4>
                    )}
                    {description && (
                        <p className="text-base leading-relaxed text-neutral-700 break-words">
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
                                userVote
                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                    : 'hover:bg-neutral-100 text-neutral-600'
                            }`}
                            onClick={voteJobab}
                            disabled={isVoting}>
                            <ThumbsUp
                                className={`w-5 h-5 transition-transform ${userVote ? 'scale-110' : ''} ${isVoting ? 'opacity-50' : ''}`}
                                fill={userVote ? 'currentColor' : 'none'}
                            />
                            <span
                                className={`font-medium text-sm sm:text-base ${isVoting ? 'opacity-50' : ''}`}>
                                {totalVotes}
                            </span>
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-neutral-100 text-neutral-600`}>
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium text-sm sm:text-base whitespace-nowrap">
                                {(commentCountData?.data.count ?? 0) > 0
                                    ? `${commentCountData?.data.count} Comments`
                                    : 'Comments'}
                            </span>
                        </button>
                    </div>
                    {(commentCountData?.data.count ?? 0) > 3 && (
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-muted-foreground hover:bg-background text-sm shrink-0"
                            onClick={() => {
                                setShowAllComments(!showAllComments);
                                if (!showAllComments) {
                                    setCurrentPage(1);
                                }
                            }}>
                            {showAllComments ? 'Hide' : `View all`}
                        </Button>
                    )}
                </div>

                {/* Comment Input */}
                {isAuthenticated && (
                    <div className="flex items-start gap-3">
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
                            <div className="flex gap-2">
                                <textarea
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    placeholder="Write a comment..."
                                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-50 hover:bg-white transition-colors resize-none overflow-y-auto min-h-[44px]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleCommentSubmit();
                                        }
                                    }}
                                    rows={1}
                                    style={{
                                        height: 'auto',
                                        minHeight: '44px',
                                    }}
                                    onInput={(e) => {
                                        const target =
                                            e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = `${target.scrollHeight}px`;
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="px-4 h-11"
                                    onClick={handleCommentSubmit}
                                    disabled={!commentText.trim()}>
                                    <SendHorizontal className="w-5 h-5" />
                                </Button>
                            </div>
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
                        onDelete={handleDeleteComment}
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

                {/* Delete Comment Confirmation Dialog */}
                <AlertDialog
                    open={!!commentToDelete}
                    onOpenChange={() => setCommentToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this comment?
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Delete Jobab Confirmation Dialog */}
                <AlertDialog
                    open={!!jobabToDelete}
                    onOpenChange={() => setJobabToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete জবাব</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this জবাব? This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmJobabDelete}
                                className="bg-red-500 hover:bg-red-600">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
