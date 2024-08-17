import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/app/components/ui/pagination';
import PetitionCard from './PetitionCard';
import useQueryParams from 'react-use-query-params';
import {trpc} from '@/app/trpc';

const PetitionList = () => {
    const [params, setParams] = useQueryParams<{
        type: string;
        page: string;
        sort: string;
    }>();

    const type =
        `${params.type}` === 'requests'
            ? 'request'
            : `${params.type}` === 'own'
              ? 'own'
              : 'formalized';

    const page = params.page.length ? Number(`${params.page}`) : 0;

    const {data: petitionRequestListResponse} = trpc.petitions.list.useQuery({
        filter: type,
        page: page,
        sort: `${params.sort}` === 'latest' ? 'time' : 'votes',
    });

    const petitions = petitionRequestListResponse?.data ?? [];

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
                                    onClick={() =>
                                        setParams((params) => ({
                                            ...params,
                                            page: [`${page - 1}`],
                                        }))
                                    }
                                />
                            </PaginationItem>
                        ) : null}

                        <PaginationItem>
                            <PaginationLink>Page {page + 1}</PaginationLink>
                        </PaginationItem>

                        {petitions.length === 33 ? (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setParams((params) => ({
                                            ...params,
                                            page: [`${page + 1}`],
                                        }))
                                    }
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
