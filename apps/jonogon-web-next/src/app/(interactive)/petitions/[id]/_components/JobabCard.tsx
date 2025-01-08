import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {ThumbsUp, MessageCircle, Check} from 'lucide-react';
import Image from 'next/image';
import {useAuthState} from '@/auth/token-manager';
import {trpc} from '@/trpc/client';

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
    const mainImage = attachments.find((a) =>
        a.filename.match(/\.(jpg|jpeg|png|gif)$/i),
    );

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
                                            className="text-blue-600 hover:underline">
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
                </div>

                {/* Image if exists */}
                {mainImage && (
                    <img
                        src={mainImage.url}
                        alt={mainImage.filename}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                )}

                {/* Interactions */}
                <div className="flex items-center gap-8 pt-2">
                    <div className="flex items-center gap-4">
                        <button
                            className={`flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-colors ${
                                user_vote === 1
                                    ? 'text-green-600'
                                    : 'text-neutral-600'
                            }`}>
                            <ThumbsUp className="w-5 h-5" />
                            <span className="font-medium">{vote_count}</span>
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
