import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {ThumbsUp, MessageCircle, Check, FileIcon} from 'lucide-react';
import Image from 'next/image';
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

interface JobabCardProps {
    id: number;
    title: string | null;
    description: string | null;
    source_type:
        | 'jonogon_direct'
        | 'news_article'
        | 'official_document'
        | 'social_media'
        | 'press_release';
    source_url: string | null;
    responded_at: string;
    created_at: string;
    respondent: {
        id: number;
        name: string;
        type: 'organization' | 'expert';
        img_url: string | null;
    } | null;
    vote_count: number;
    user_vote: number | null;
    attachments: {
        id: number;
        filename: string;
        type: 'image' | 'file';
        url: string;
    }[];
}

export default function JobabCard({
    id,
    title,
    description,
    source_type,
    source_url,
    responded_at,
    created_at,
    respondent,
    vote_count,
    user_vote,
    attachments,
}: JobabCardProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();
    const {toast} = useToast();

    const sourceTypeLabels: Record<JobabCardProps['source_type'], string> = {
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
            // Optimistically update
            setVoted(true);
            setTotalVotes((prev) => prev + 1);
        },
        onError: () => {
            // Revert on error
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
            // Optimistically update
            setVoted(false);
            setTotalVotes((prev) => prev - 1);
        },
        onError: () => {
            // Revert on error
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

    useEffect(() => {
        setTotalVotes(vote_count);
    }, [vote_count]);

    return (
        <div className="flex gap-3">
            <div className="w-1 bg-red-500 rounded-full" />
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
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
                        <div className="space-y-1">
                            <p className="font-semibold text-base">
                                {respondent?.name}
                            </p>
                            <p className="text-sm text-muted-foreground space-x-2">
                                <span>
                                    {(() => {
                                        const date = new Date(responded_at);
                                        const day = date.getDate();
                                        const suffix = ['th', 'st', 'nd', 'rd'][
                                            day % 10 > 3 ||
                                            (day % 100) - (day % 10) == 10
                                                ? 0
                                                : day % 10
                                        ];
                                        return `${day}${suffix} ${date.toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'long',
                                                year: 'numeric',
                                            },
                                        )}`;
                                    })()}
                                </span>
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
                                            className="underline">
                                            Source
                                        </a>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1.5 border rounded-md border-green-500 bg-green-50 text-green-700 text-sm flex items-center gap-2">
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

                {/* Content */}
                <div className="space-y-3">
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
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground">
                                Attached Files
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {fileAttachments.map((file) => (
                                    <a
                                        key={file.id}
                                        href={file.url.replace(
                                            '$CORE_HOSTNAME',
                                            window.location.hostname,
                                        )}
                                        target="_blank"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-md shadow-sm transition-all text-sm group">
                                        <div className="p-0.5 bg-neutral-100 rounded">
                                            <FileIcon className="w-3 h-3 text-neutral-500" />
                                        </div>
                                        <span className="font-medium text-neutral-700 text-xs">
                                            {file.filename}
                                        </span>
                                        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded uppercase">
                                            {file.filename.split('.').pop()}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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
                                            className="w-full h-64 object-cover rounded-lg cursor-pointer"
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
                                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                                </>
                            )}
                        </Carousel>

                        {/* Full Screen Image Modal */}
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
                )}
                {/* Interactions */}
                <div className="flex items-center gap-8 pt-2">
                    <div className="flex items-center gap-4">
                        <button
                            className={`flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-colors ${
                                voted ? 'text-green-600' : 'text-neutral-600'
                            }`}
                            onClick={voteJobab}>
                            <ThumbsUp
                                className="w-5 h-5"
                                fill={voted ? 'currentColor' : 'none'}
                            />
                            <span className="font-medium">{totalVotes}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-colors text-neutral-600">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">Comments</span>
                        </button>
                    </div>
                    <button className="text-neutral-600 hover:text-neutral-800 transition-colors">
                        See all comments
                    </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-3 pt-2">
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
                                    placeholder="Write a comment..."
                                    className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
