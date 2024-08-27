'use client';

import Loading from '@/app/petitions/[id]/loading';

export const runtime = 'edge';

import {useEffect, useState} from 'react';
import Markdown from 'react-markdown';
import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ImageCarousel} from './components/ImageCarousel';
import {trpc} from '@/trpc';
import {useAuthState} from '@/auth/token-manager';
import {useParams, useRouter} from 'next/navigation';
import CommentThread from './components/comments/Thread';

export default function Petition() {
    const utils = trpc.useUtils();

    const router = useRouter();
    const isAuthenticated = useAuthState();

    const {data: selfResponse} = trpc.users.getSelf.useQuery(undefined, {
        enabled: !!isAuthenticated,
    });

    const {id: petition_id} = useParams<{id: string}>();

    const {
        data: petition,
        refetch,
        isLoading,
    } = trpc.petitions.get.useQuery({
        id: petition_id!!,
    });

    const [userVote, setUserVote] = useState(0);

    useEffect(() => {
        if (petition) {
            setUserVote(petition?.extras.user_vote ?? 0);
        }
    }, [petition]);

    const thumbsUpMutation = trpc.petitions.vote.useMutation();
    const thumbsDownMutation = trpc.petitions.vote.useMutation();
    const clearVoteMutation = trpc.petitions.clearVote.useMutation();

    const clickThumbsUp = async () => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        if (userVote == 1) {
            await clearVoteMutation.mutateAsync({
                petition_id: petition_id!!,
            });
            setUserVote(0);
        } else {
            await thumbsUpMutation.mutateAsync({
                petition_id: petition_id!!,
                vote: 'up',
            });
            setUserVote(1);
        }
        refetch();
    };

    const clickThumbsDown = async () => {
        if (!isAuthenticated) {
            redirectToLoginPage();
            return;
        }

        if (userVote == -1) {
            await clearVoteMutation.mutateAsync({
                petition_id: petition_id!!,
            });
            setUserVote(0);
        } else {
            await thumbsDownMutation.mutateAsync({
                petition_id: petition_id!!,
                vote: 'down',
            });
            setUserVote(-1);
        }
        refetch();
    };

    const redirectToLoginPage = () => {
        const nextUrl = encodeURIComponent(`/petitions/${petition_id}`);
        router.push(`/login?next=${nextUrl}`);
    };

    const upvoteCount = petition?.data.petition_upvote_count ?? 0;
    const downvoteCount = petition?.data.petition_downvote_count ?? 0;
    const totalVoteCount = upvoteCount + downvoteCount;

    const isOwnPetition =
        petition &&
        selfResponse &&
        `${petition?.data.created_by}` === `${selfResponse?.data.id}`;

    const isAdmin = !!selfResponse?.meta.token.is_user_admin;
    const isMod = !!selfResponse?.meta.token.is_user_moderator;
    const status = petition?.data.status ?? 'draft';

    const {mutate: approve} = trpc.petitions.approve.useMutation({
        onSuccess: async () => {
            await utils.petitions.get.invalidate({id: petition_id});
        },
    });

    const {mutate: reject} = trpc.petitions.reject.useMutation({
        onSuccess: async () => {
            await utils.petitions.get.invalidate({id: petition_id});
        },
    });

    const {mutate: formalize} = trpc.petitions.formalize.useMutation({
        onSuccess: async () => {
            await utils.petitions.get.invalidate({id: petition_id});
        },
    });

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <div className="max-w-screen-sm mx-auto px-4 pt-12 mb-28 flex flex-col gap-4">
                {isOwnPetition || isMod || isAdmin ? (
                    <div
                        className={
                            'bg-border px-3 py-2 rounded-lg flex justify-end items-center gap-2'
                        }>
                        {status === 'rejected' ? (
                            <div className={'flex-1'}>
                                <div
                                    className={
                                        'font-bold text-red-500 text-sm'
                                    }>
                                    Your petition was rejected.
                                </div>
                                <div>
                                    {petition?.data.rejection_reason ?? ''}
                                </div>
                            </div>
                        ) : null}
                        {isMod || isAdmin ? (
                            <div className={'flex flex-row gap-2 items-center'}>
                                {status === 'submitted' ? (
                                    <span className={'text-sm'}>
                                        NOT MODERATED YET
                                    </span>
                                ) : null}
                                {status === 'approved' ? (
                                    <Button
                                        size={'sm'}
                                        intent={'success'}
                                        onClick={() =>
                                            window.confirm(
                                                'You sure you wanna elevate to this some next level shizz?',
                                            ) &&
                                            formalize({
                                                petition_id:
                                                    Number(petition_id),
                                            })
                                        }>
                                        Formalize
                                    </Button>
                                ) : null}
                                {status === 'submitted' ||
                                status === 'rejected' ? (
                                    <Button
                                        size={'sm'}
                                        intent={'success'}
                                        onClick={() =>
                                            window.confirm(
                                                'You sure you wanna approve?',
                                            ) &&
                                            approve({
                                                petition_id:
                                                    Number(petition_id),
                                            })
                                        }>
                                        Approve
                                    </Button>
                                ) : null}
                                {status !== 'rejected' && status !== 'draft' ? (
                                    <Button
                                        size={'sm'}
                                        intent={'default'}
                                        onClick={() => {
                                            const rejectionReason =
                                                window.prompt(
                                                    'Why you rejecting? (leave empty to cancel)',
                                                );

                                            rejectionReason &&
                                                reject({
                                                    petition_id:
                                                        Number(petition_id),
                                                    reason: rejectionReason,
                                                });
                                        }}>
                                        Reject
                                    </Button>
                                ) : null}
                            </div>
                        ) : null}

                        {isOwnPetition || isAdmin ? (
                            <Button
                                size={'sm'}
                                onClick={() =>
                                    router.push(
                                        `/petitions/${petition_id}/edit`,
                                    )
                                }>
                                Edit দাবি
                            </Button>
                        ) : null}
                    </div>
                ) : null}

                <div className={'space-x-1 text-lg text-stone-500'}>
                    <time
                        dateTime={
                            petition?.data.created_at
                                ? new Date(
                                      petition.data.created_at,
                                  ).toISOString()
                                : ''
                        }
                        suppressHydrationWarning>
                        {petition?.data.created_at
                            ? new Date(
                                  petition.data.created_at,
                              ).toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })
                            : 'UNKNOWN DATE'}
                        {','}
                    </time>
                    <span className={'italic font-semibold'}>
                        {petition?.extras.user.name ?? ''}
                    </span>
                    <span>—</span>
                    <span>To</span>
                    <span className={'italic font-semibold'}>
                        {petition?.data.target ?? 'UNKNOWN MINISTRY'}.
                    </span>
                </div>
                <h1 className="text-4xl font-bold font-serif">
                    {petition?.data.title ?? 'Untiled Petition'}
                </h1>
                <div className="space-x-2 border-l-4 pl-4 text-neutral-700 text-lg">
                    <span>It affects</span>
                    <span className={'italic font-semibold'}>
                        {petition?.data.location ?? 'SOMEONE, SOMEWHERE'}.
                    </span>
                </div>
                <ImageCarousel />
                {petition?.data.description && (
                    <Markdown>
                        {petition.data.description ?? 'No description yet.'}
                    </Markdown>
                )}
                <CommentThread />
            </div>

            <div className="fixed bottom-0 left-0 w-full py-2 bg-background z-20 px-4">
                <div
                    className={
                        'w-full mx-auto max-w-screen-sm flex flex-row space-x-2'
                    }>
                    <Button
                        variant={
                            userVote === 1 || userVote === 0
                                ? 'default'
                                : 'outline'
                        }
                        intent={'success'}
                        size={'lg'}
                        className="flex-1 w-full"
                        onClick={clickThumbsUp}>
                        {status === 'formalized' ? (
                            <>
                                <p className="ml-2">{upvoteCount} — VOTE</p>
                            </>
                        ) : (
                            <>
                                <ThumbsUp size={20} />{' '}
                                <p className="ml-2">{upvoteCount}</p>
                            </>
                        )}
                    </Button>
                    <Button
                        variant={
                            userVote === -1 || userVote === 0
                                ? 'default'
                                : 'outline'
                        }
                        intent={'default'}
                        className="flex-1 w-full"
                        size={'lg'}
                        onClick={clickThumbsDown}>
                        <ThumbsDown size={20} />{' '}
                        <p className="ml-2">{downvoteCount}</p>
                    </Button>
                </div>
            </div>
        </>
    );
}
