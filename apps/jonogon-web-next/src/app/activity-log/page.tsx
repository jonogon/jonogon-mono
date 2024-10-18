'use client';

import {PropsWithChildren, useEffect} from 'react';
import {useRouter, useSearchParams, usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import Link from 'next/link';
import {trpc} from '@/trpc/client';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAuthState } from '@/auth/token-manager';

const ACTIVITY_TYPES = [
    'petitions',
    'comments',
    'comment_votes',
    'petition_votes',
] as const;

const ActivityTypeValidator = z.enum(ACTIVITY_TYPES);

type ActivityType = z.infer<typeof ActivityTypeValidator>;

function useActivityTypeParam() : ActivityType {
    const params = useSearchParams();

    const activityType = 
        ActivityTypeValidator.safeParse(params.get('activity-type'));

    if (!activityType.success) {
        // default to petition_votes
        return 'petition_votes';
    }

    return activityType.data;
}

function Tab({
    activityType,
    children,
}: PropsWithChildren<{activityType: ActivityType}>) {
    const router = useRouter();
    const path = usePathname();

    const activityTypeParam = useActivityTypeParam();

    const updateParams = () => {
        const nextSearchParams = new URLSearchParams();
        nextSearchParams.set('activity-type', activityType);

        router.replace(`${path}?${nextSearchParams.toString()}`);
    };

    return (
        <button
            className={cn(
                'border-b-2 border-transparent px-3 pb-1 capitalize select-none text-sm',
                {
                    'border-red-500 text-red-500': activityTypeParam === activityType,
                },
            )}
            onClick={updateParams}>
            {children}
        </button>
    );
}

const ActivityCardsLoader = () =>
    Array(4)
        .fill(null)
        .map((_, i) => {
            return (
                <Card
                    className={'bg-border animate-pulse h-16'}
                    key={i}
                />
            );
        });

const ACTIVITY_TYPE_TAB_OPTIONS = [
    {label: 'দাবি Votes', value: 'petition_votes'},
    {label: 'Comment Votes', value: 'comment_votes'},
    // {label: 'দাবিs Created', value: 'petitions'},
    {label: 'Comments Made', value: 'comments'},
] as const;

const ActivityCard = ({children}: PropsWithChildren<{}>) => (
    <Card className='p-5'>
        {children}
    </Card>
);

const Bold = ({children}: PropsWithChildren<{}>) => (
    <span className='font-bold'>{children}</span>
);

function getPaddedClippedContent(content: string | null | undefined, maxLength?: number) {
    if (!content) {
        return ` "" `;
    }

    if (!maxLength || content.length <= maxLength) {
        return ` "${content}" `;
    }

    return ` "${content.slice(0, maxLength)}..." `;
}

export default function ActivityLog() {
    const activityType = useActivityTypeParam();
    const isAuthenticated = useAuthState();

    const {
        mutate: getUserActivityLog, 
        data: activityLog,
        isLoading: isLoadingActivityLog,
        error,
    } = trpc.activity.userActivityLog.useMutation();
    
    useEffect(() => {
        if (isAuthenticated) {
            getUserActivityLog({activity_type: activityType});
        }
    }, [activityType, isAuthenticated, getUserActivityLog]);

    function getPageOfCurrentActivityType(page: number) {
        if (!activityLog || activityType !== activityLog.data.activity_type) {
            return;
        }

        getUserActivityLog({
            activity_type: activityLog.data.activity_type,
            page: page,
        });
    }


    function activityLogForSelectedTab() {
        if (!isAuthenticated || isLoadingActivityLog) {
            return <ActivityCardsLoader />;
        }

        if (!activityLog) {
            return null;
        }

        switch (activityLog.data.activity_type) {
            case 'comments':
                return activityLog.data
                    .comments
                    .map((comment) => (
                        <Link key={comment.id} href={`/petitions/${comment.petition_id}`}>
                            <ActivityCard>
                                Commented
                                <Bold>
                                    {getPaddedClippedContent(comment.body, 30)}
                                </Bold>
                                on দাবি:
                                <Bold>
                                    {getPaddedClippedContent(comment.petition_title)}
                                </Bold>
                            </ActivityCard>
                        </Link>
                    ));
            case 'comment_votes':
                return activityLog.data
                    .comment_votes
                    .map((commentVote) => (
                        <Link key={commentVote.id} href={`/petitions/${commentVote.petition_id}`}>
                            <ActivityCard>
                                <Bold> {commentVote.vote > 0 ? "Liked" : "Disliked"} </Bold> 
                                a comment
                                <Bold>
                                    {getPaddedClippedContent(commentVote.body, 30)}
                                </Bold>
                                on দাবি:
                                <Bold>{getPaddedClippedContent(commentVote.petition_title)}</Bold>
                            </ActivityCard>
                        </Link>
                    ));
            case 'petitions':
                return activityLog.data
                    .petitions
                    .map((petition) => (
                        <Link key={petition.id} href={`/petitions/${petition.id}`}>
                            <ActivityCard>
                                Created a দাবি:
                                <Bold>{getPaddedClippedContent(petition.title)}</Bold>
                            </ActivityCard>
                        </Link>
                    ));
            case 'petition_votes':
                return activityLog.data
                    .petition_votes
                    .map((vote) => (
                        <Link key={vote.id} href={`/petitions/${vote.petition_id}`}>
                            <ActivityCard>
                                <Bold> {vote.vote > 0 ? "Liked" : "Disliked"} </Bold>
                                a দাবি:
                                <Bold>{getPaddedClippedContent(vote.title)}</Bold>
                            </ActivityCard>
                        </Link>
                    ));
            
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4 max-w-screen-sm mx-auto pb-16 px-4">
                <h1 className="mt-12 my-5 text-3xl md:text-4xl font-bold text-red-500 min-h-20">
                    My Activity
                </h1>
                <div className="flex flex-row gap-1">
                    {ACTIVITY_TYPE_TAB_OPTIONS.map((option) => (
                        <Tab key={option.value} activityType={option.value}>
                            {option.label}
                        </Tab>
                    ))}
                </div>
                <div className='flex flex-col gap-2'>
                    {activityLogForSelectedTab()}
                </div>
            </div>
            {activityLog?.data
                ? (
                    <div className={'py-4'}>
                        <Pagination>
                            <PaginationContent>
                                {activityLog?.data.page !== 0 ? (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => getPageOfCurrentActivityType(activityLog.data.page - 1)}
                                        />
                                    </PaginationItem>
                                ) : null}

                                <PaginationItem>
                                    <PaginationLink>Page {activityLog.data.page + 1}</PaginationLink>
                                </PaginationItem>

                                {activityLog.data.hasNextPage ? (
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => getPageOfCurrentActivityType(activityLog.data.page + 1)}
                                        />
                                    </PaginationItem>
                                ) : null}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )
                :null
            }
        </>
    );
}
