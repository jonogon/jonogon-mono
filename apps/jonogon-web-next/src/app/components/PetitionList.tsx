import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import PetitionCard from './PetitionCard';
import {trpc} from '@/trpc';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

const PetitionList = () => {
    const params = useSearchParams();

    const type =
        params.get('type') === 'requests'
            ? 'request'
            : params.get('type') === 'own'
              ? 'own'
              : 'formalized';

    const page = params.get('page') ? Number(params.get('page')) : 0;

    const {data: petitionRequestListResponse} = trpc.petitions.list.useQuery({
        filter: type,
        page: page,
        sort: params.get('sort') === 'latest' ? 'time' : 'votes',
    });

    const petitions = petitionRequestListResponse?.data ?? [];

    const router = useRouter();
    const pathname = usePathname();

    const setPage = (page: number) => {
        const nextParams = new URLSearchParams(params);
        nextParams.set('page', `${page}`);

        router.push(`${pathname}?${nextParams}`);
    };

    return (
        <div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px',
                }}>
                {petitions.slice(0, 32).map((p) => {
                    return (
                        <PetitionCard
                            id={p.data.id}
                            mode={type}
                            status={p.data.status}
                            name={p.extras.user.name ?? ''}
                            title={p.data.title ?? 'Untitled Petition'}
                            date={new Date(p.data.submitted_at ?? '1970-01-01')}
                            target={p.data.target ?? 'Some Ministry'}
                            key={p.data.id ?? 0}
                            upvotes={Number(p.data.petition_upvote_count) ?? 0}
                            downvotes={
                                Number(p.data.petition_downvote_count) ?? 0
                            }
                        />
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
