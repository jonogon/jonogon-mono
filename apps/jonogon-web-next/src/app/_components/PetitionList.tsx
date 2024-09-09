import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import PetitionCard from './PetitionCard';
import {trpc} from '@/trpc/client';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useAutoAnimate} from '@formkit/auto-animate/react';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {
    getDabiType,
    getDefaultSortForDabiType,
    getSortType,
} from './petitionSortUtils';
import {MondayCountdown} from '@/app/_components/MondayCountdown';

const PetitionCardsLoader = () =>
    Array(4)
        .fill(null)
        .map((_, i) => {
            return (
                <div
                    className={'w-full bg-border animate-pulse h-32'}
                    key={i}></div>
            );
        });

const NoPetitionsView = () => (
    <div>
        <div className={'text-center text-lg font-semibold p-5'}>
            No দাবিs found
        </div>
        <div className={'text-center text-sm text-gray-500 pb-5'}>
            Submit a new দাবি or পরে check করুন
        </div>
    </div>
);

const PetitionList = () => {
    const [animationParent] = useAutoAnimate();

    const params = useSearchParams();

    const type = getDabiType(params.get('type'));
    const page = params.get('page') ? Number(params.get('page')) : 0;
    const sort = getDefaultSortForDabiType(
        getSortType(params.get('sort')),
        type,
    );

    // Don't fuck up order if sorting by time
    const [fuckUpOrder, setFuckupOrder] = useState(sort !== 'time');

    const {data: petitionRequestListResponse, isLoading} =
        trpc.petitions.list.useQuery(
            {
                filter: type,
                page: page,
                sort: sort,
            },
            {
                refetchInterval:
                    process.env.NODE_ENV === 'development' ? 5_000 : 30_000,
            },
        );

    useEffect(() => {
        if (petitionRequestListResponse?.data) {
            setTimeout(() => {
                setFuckupOrder(false);
            }, 1_000);
        }
    }, [petitionRequestListResponse?.data]);

    const petitions = useMemo(() => {
        const responseData = petitionRequestListResponse?.data;

        if (responseData) {
            if (fuckUpOrder && responseData.length > 1) {
                const nextData = [...responseData];

                const tmp = nextData[0];
                nextData[0] = nextData[1];
                nextData[1] = tmp;

                return nextData;
            } else {
                return responseData;
            }
        }

        return [];
    }, [petitionRequestListResponse?.data, fuckUpOrder]);

    const router = useRouter();
    const pathname = usePathname();

    const setPage = (page: number) => {
        const nextParams = new URLSearchParams(params);
        nextParams.set('page', `${page}`);

        router.push(`${pathname}?${nextParams}`);
    };

    const hasNoPetitions = petitions.length === 0;

    return (
        <div>
            <div className={'flex flex-col space-y-1'} ref={animationParent}>
                {isLoading ? (
                    <PetitionCardsLoader />
                ) : hasNoPetitions ? (
                    <NoPetitionsView />
                ) : (
                    petitions.slice(0, 32).map((p, i) => (
                        <Fragment key={p.data.id}>
                            <PetitionCard
                                id={p.data.id}
                                userVote={p.extras.user_vote}
                                mode={type}
                                status={p.data.status}
                                name={p.extras.user.name ?? ''}
                                title={p.data.title ?? 'Untitled Petition'}
                                attachment={p.data.attachment ?? ''}
                                date={
                                    new Date(p.data.created_at ?? '1970-01-01')
                                }
                                target={p.data.target ?? 'Some Ministry'}
                                key={p.data.id ?? 0}
                                upvotes={
                                    Number(p.data.petition_upvote_count) ?? 0
                                }
                                downvotes={
                                    Number(p.data.petition_downvote_count) ?? 0
                                }
                                upvoteTarget={Number(p.data.upvote_target) ?? 0}
                            />
                            {type === 'request' &&
                            sort === 'votes' &&
                            page === 0 &&
                            i ===
                                (process.env.NODE_ENV === 'development'
                                    ? 0
                                    : 4) ? (
                                <div
                                    key={'formalization-line'}
                                    className={
                                        'py-2 text-center text-green-700 flex flex-col items-center'
                                    }>
                                    <div
                                        className={
                                            'py-3 text-center w-full font-semibold'
                                        }>
                                        ☝️ Formalizing in <MondayCountdown />
                                    </div>
                                    <div
                                        className={
                                            'border-b-2 border-green-600 w-full scale-x-105 md:scale-x-110'
                                        }></div>
                                </div>
                            ) : null}
                        </Fragment>
                    ))
                )}
            </div>
            <div className={'py-4'}>
                <Pagination>
                    <PaginationContent>
                        {page !== 0 ? (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPage(page - 1)}
                                />
                            </PaginationItem>
                        ) : null}

                        <PaginationItem>
                            <PaginationLink>Page {page + 1}</PaginationLink>
                        </PaginationItem>

                        {petitions.length === 33 ? (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPage(page + 1)}
                                />
                            </PaginationItem>
                        ) : null}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default PetitionList;
