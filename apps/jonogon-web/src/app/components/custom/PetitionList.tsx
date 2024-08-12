import {cn} from '@/app/lib/utils';
import {RxCaretSort, RxCheck} from 'react-icons/rx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination';
import PetitionCard from './PetitionCard';
import {useStore, useStoreSetter} from '@/app/state/context';
import {observer} from 'mobx-react-lite';
type Tstatus = 'all' | 'formalized';
type Tsort = 'latest' | 'oldest' | 'up votes' | 'down votes';

const PetitionList = observer(() => {
    const store = useStore();
    const setStore = useStoreSetter();
    const {filters} = store;

    return (
        <div className="h-[calc(100dvh-65px)] overflow-y-auto">
            <div className="container flex flex-col gap-4">
                <h3 className="mt-5 text-4xl">
                    Explore petitions open for voting
                </h3>
                <div className="border-b border-neutral-200 flex items-center justify-between my-2">
                    <div>
                        {['all', 'formalized'].map((status) => (
                            <button
                                key={status}
                                className={cn(
                                    'border-b-2 border-transparent px-3 pb-1 capitalize select-none',
                                    {
                                        'border-black':
                                            filters.status === status,
                                    },
                                )}
                                onClick={() =>
                                    setStore(
                                        (store) =>
                                            (store.filters.status =
                                                status as Tstatus),
                                    )
                                }>
                                {status}
                            </button>
                        ))}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="flex items-center gap-2 pb-1">
                                <span className="capitalize text-sm select-none">
                                    {filters.sort}
                                </span>
                                <RxCaretSort />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}>
                            {['latest', 'oldest', 'up votes', 'down votes'].map(
                                (sort) => (
                                    <DropdownMenuItem
                                        key={sort}
                                        className="capitalize flex items-center justify-between"
                                        onSelect={() =>
                                            setStore(
                                                (store) =>
                                                    (store.filters.sort =
                                                        sort as Tsort),
                                            )
                                        }>
                                        <span>{sort}</span>
                                        {filters.sort === sort && <RxCheck />}
                                    </DropdownMenuItem>
                                ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-4">
                    <PetitionCard />
                    <PetitionCard />
                    <PetitionCard />
                    <PetitionCard />
                    <PetitionCard />
                    <PetitionCard />
                    <PetitionCard />
                    <PetitionCard />
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
});

export default PetitionList;
