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

const PetitionList = () => {
    const [fuckUpOrder, setFuckupOrder] = useState(true);

    const [animationParent] = useAutoAnimate();

    const params = useSearchParams();

    const type =
        params.get('type') === 'formalized'
            ? 'formalized'
            : params.get('type') === 'own'
              ? 'own'
              : 'request';

    const page = params.get('page') ? Number(params.get('page')) : 0;
    const sort = params.get('sort') === 'latest' ? 'time' : 'votes';

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
        if (petitionRequestListResponse?.data) {
            if (fuckUpOrder) {
                const nextData = [...petitionRequestListResponse.data];

                const tmp = nextData[0];
                nextData[0] = nextData[1];
                nextData[1] = tmp;

                return nextData;
            } else {
                return petitionRequestListResponse.data;
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

    return (
        <div>
            <div className={'flex flex-col space-y-1'} ref={animationParent}>
                {isLoading
                    ? Array(4)
                          .fill(null)
                          .map((_, i) => {
                              return (
                                  <div
                                      className={
                                          'w-full bg-border animate-pulse h-32'
                                      }
                                      key={i}></div>
                              );
                          })
                    : petitions.slice(0, 32).map((p, i) => {
                          if (!p) {
                              return null;
                          }
                          return (
                              <Fragment key={p.data.id}>
                                  <PetitionCard
                                      id={p.data.id}
                                      userVote={p.extras.user_vote}
                                      mode={type}
                                      status={p.data.status}
                                      name={p.extras.user.name ?? ''}
                                      title={
                                          p.data.title ?? 'Untitled Petition'
                                      }
                                      attachment={p.data.attachment ?? ''}
                                      date={
                                          new Date(
                                              p.data.submitted_at ??
                                                  '1970-01-01',
                                          )
                                      }
                                      target={p.data.target ?? 'Some Ministry'}
                                      key={p.data.id ?? 0}
                                      upvotes={
                                          Number(
                                              p.data.petition_upvote_count,
                                          ) ?? 0
                                      }
                                      downvotes={
                                          Number(
                                              p.data.petition_downvote_count,
                                          ) ?? 0
                                      }
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
                                              'py-5 text-center text-green-700 flex flex-row items-center relative'
                                          }>
                                          <div
                                              className={
                                                  'border-t-2 border-dashed border-t-green-500 w-full absolute'
                                              }></div>
                                          <div
                                              className={
                                                  'top-0 pr-4 left-0 bg-background z-[1] font-semibold'
                                              }>
                                              ☝️ যেসব দাবি, Formalization-এর
                                              জন্য review করা হবে
                                          </div>
                                      </div>
                                  ) : null}
                              </Fragment>
                          );
                      })}
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
