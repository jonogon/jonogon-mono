import {Card, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

import {
    HandThumbUpIcon as ThumbsUpIconSolid,
    HandThumbDownIcon as ThumbsDownIconSolid,
} from '@heroicons/react/24/solid';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {FaRegComment as CommentIconOutline} from 'react-icons/fa';

import {
    HandThumbUpIcon as ThumbsUpIconOutline,
    HandThumbDownIcon as ThumbsDownIconOutline,
} from '@heroicons/react/24/outline';

import {useAuthState} from '@/auth/token-manager';
import {formatDate} from '@/lib/date';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {useRelativeTime} from '@/lib/useRelativeTime';

export default function PetitionCard(props: {
    id: string;

    name: string;
    date: Date;
    target: string;
    title: string;
    attachment: string;
    jobab: any;

    status: string;

    userVote: number | null;

    upvoteTarget: number | null;

    upvotes: number;
    downvotes: number;
    comments: number;

    mode: 'request' | 'formalized' | 'own' | 'flagged';
}) {
    const isAuthenticated = useAuthState();
    // Keep vote state exactly as received from backend
    const [localUserVote, setLocalUserVote] = useState<number | null>(
        props.userVote,
    );

    // Simple helper for vote state
    const hasVoted = isAuthenticated === true && localUserVote !== null;

    useEffect(() => {
        // Only update when props.userVote changes
        setLocalUserVote(props.userVote);
    }, [props.userVote]);

    const router = useRouter();

    const achievement = props.upvotes / Number(props.upvoteTarget);
    const achievementPercentage = Math.round(achievement * 100);
    const ResponseCard = () => {
        const relativeTime = useRelativeTime(props.jobab.responded_at)
        return (
            <div className="my-6 mx-4 rounded-lg overflow-hidden">
                <div className="bg-red-50 p-4">
                    <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                        <div className="flex gap-2">
                            <Avatar className="h-12 w-12 shrink-0">
                                <AvatarImage
                                    className="border-4 rounded-full w-12 h-12"
                                    src={(
                                        props.jobab.respondent_img_url ??
                                        `https://static.jonogon.org/placeholder-images/${((Number(props.jobab.respondent_id ?? 0) + 1) % 11) + 1}.jpg`
                                    ).replace(
                                        '$CORE_HOSTNAME',
                                        window.location.hostname,
                                    )}
                                    alt={props.jobab.respondent_name ?? 'Respondent'}
                                />
                                <AvatarFallback>
                                    <div className="bg-border rounded-full animate-pulse h-12 w-12"></div>
                                </AvatarFallback>
                            </Avatar>
                        <div className="word-break basis-96">
                            <h3 className="font-semibold text-red-500">
                                {props.jobab.respondent_name }
                            </h3>
                            <p className="text-sm text-red-400 capitalize">
                                {props.jobab.source_type.replace(/_/g, ' ')}
                            </p>
                        </div>
                    </div>
                    <span className="text-sm text-red-400 basis-28 text-left sm:text-right">
                        { relativeTime } ago
                    </span>
                    </div>
                    <p className="mt-3 text-red-500 truncate italic">
                        {props.jobab.description}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <Link href={`/petitions/${props.id}`}>
            <Card className={''}>
                <CardHeader className={'p-4'}>
                    <CardTitle
                        className={'flex flex-row items-stretch space-x-4'}>
                        <div className={'flex-1'}>
                            <h2
                                className={
                                    'leading-[1.1] font-bold font-serif text-xl md:text-2xl align-middle break-words overflow-hidden text-ellipsis'
                                }>
                                {props.title}
                            </h2>
                            <div
                                className={
                                    'font-normal text-base text-neutral-500 pt-1'
                                }>
                                <div>
                                    <i>{props.name}</i> —{' '}
                                    <time
                                        dateTime={props.date.toISOString()}
                                        suppressHydrationWarning>
                                        {formatDate(props.date)}
                                    </time>
                                </div>
                            </div>
                        </div>

                        {props.attachment && (
                            <div className={''}>
                                <img
                                    src={`${props.attachment}`.replace(
                                        '$CORE_HOSTNAME',
                                        window.location.hostname,
                                    )}
                                    className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded bg-background"
                                />
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex items-center justify-between p-2 px-4 border-t border-t-background">
                    {props.mode === 'formalized' ? (
                        <>
                            <div
                                className={
                                    'font-semibold text-red-600 px-1 flex items-center flex-row'
                                }>
                                <div
                                    className={
                                        'h-2 w-8 md:w-24 inline-block bg-background mr-2'
                                    }>
                                    <div
                                        className={'h-2 bg-red-500'}
                                        style={{
                                            width: `${achievementPercentage}%`,
                                        }}></div>
                                </div>
                                <span className={'mr-4 md:mr-6'}>
                                    {achievementPercentage}%
                                </span>
                                <div>
                                    <span className={'text-black font-light'}>
                                        আরো
                                    </span>{' '}
                                    {(props.upvoteTarget ?? 0) - props.upvotes}
                                    <span className={'text-black font-light'}>
                                        -টা Vote দরকার
                                    </span>{' '}
                                </div>
                            </div>
                            <Button
                                size={'sm'}
                                variant={hasVoted ? 'ghost' : 'outline'}
                                disabled={hasVoted}
                                onClick={() => {
                                    const href = `/petitions/${props.id}`;

                                    isAuthenticated
                                        ? router.push(href)
                                        : router.push(
                                              `/login?next=${encodeURIComponent(href)}`,
                                          );
                                }}>
                                {hasVoted ? 'VOTED' : 'VOTE'}
                            </Button>
                        </>
                    ) : (
                        <div className="flex justify-between align-middle gap-2 w-full">
                            <div className="flex gap-6">
                                <div className="flex items-center gap-1">
                                    {localUserVote === 1 ? (
                                        <ThumbsUpIconSolid
                                            className="w-5 h-5 text-green-500"
                                        />
                                    ) : (
                                        <ThumbsUpIconOutline
                                            className="w-5 h-5 text-green-500"
                                        />
                                    )}

                                    {props.upvotes}
                                </div>
                                <div className="flex items-center gap-1">
                                    {localUserVote === -1 ? (
                                        <ThumbsDownIconSolid
                                            className="w-5 h-5 text-red-500"
                                        />
                                    ) : (
                                        <ThumbsDownIconOutline
                                            className="w-5 h-5 text-red-500"
                                        />
                                    )}

                                    {props.downvotes}
                                </div>
                                <div className="flex items-center gap-1">
                                    <CommentIconOutline className={'w-5 h-5 text-gray-500'} />
                                    <span className="hidden sm:block">
                                        {props.comments}{' '}Comments
                                    </span>
                                </div>
                            </div>
                            {props.mode === 'own' ?
                                (<div className="font-mono text-sm">
                                STATUS: {props.status}
                                </div>) : (
                                <Button
                                    size={'sm'}
                                    variant={hasVoted ? 'ghost' : 'outline'}
                                    disabled={hasVoted}
                                    onClick={() => {
                                        const href = `/petitions/${props.id}`;

                                        isAuthenticated
                                            ? router.push(href)
                                            : router.push(
                                                `/login?next=${encodeURIComponent(href)}`,
                                            );
                                    }}>
                                    {hasVoted ? 'VOTED' : 'VOTE'}
                                </Button>
                            )
                        }
                    </div>
                )}
            </CardFooter>
            {props.jobab && <div>{ResponseCard()}</div>}
            </Card>
        </Link>
    );
}
