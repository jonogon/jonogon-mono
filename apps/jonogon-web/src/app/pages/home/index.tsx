import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {cn} from '@/app/lib/utils';
import {useStore, useStoreSetter} from '@/app/state/context';
import {observer} from 'mobx-react-lite';
import {RxCaretSort, RxCheck} from 'react-icons/rx';
import PetitionList from './components/PetitionList';
import useQueryParams from 'react-use-query-params';
import {trpc} from '@/app/trpc';
import PetitionActionButton from '@/app/components/custom/PetitionActionButton';
import {PropsWithChildren} from 'react';

type Tstatus = 'all' | 'formalized';
type Tsort = 'latest' | 'oldest' | 'up votes' | 'down votes';

const FloatingButtonSection = () => (
    <div className="fixed bottom-0 left-0 w-full bg-background/50">
        <div
            className={
                'max-w-screen-sm w-full mx-auto flex flex-col py-4 px-4'
            }>
            <PetitionActionButton />
        </div>
    </div>
);

function Tab({
    type,
    children,
}: PropsWithChildren<{type: 'requests' | 'formalized'}>) {
    const [params, setParams] = useQueryParams<{
        type: 'requests' | 'formalized';
    }>();

    return (
        <button
            className={cn(
                'border-b-2 border-transparent px-3 pb-1 capitalize select-none',
                {
                    'border-black': (`${params.type}` || 'formalized') === type,
                },
            )}
            onClick={() => setParams((params) => ({...params, type: [type]}))}>
            {children}
        </button>
    );
}

function SortOption({
    sort,
    children,
}: PropsWithChildren<{sort: 'latest' | 'votes'}>) {
    const [params, setParams] = useQueryParams<{
        sort: 'latest' | 'votes';
    }>();

    return (
        <DropdownMenuItem
            className="capitalize flex items-center justify-between"
            onSelect={() => setParams((params) => ({...params, sort: [sort]}))}>
            <span>{children}</span>
            {(`${params.sort}` || 'votes') === sort ? <RxCheck /> : null}
        </DropdownMenuItem>
    );
}

const Home = observer(() => {
    const store = useStore();
    const setStore = useStoreSetter();
    const {filters} = store;
    const {data: petitions} = trpc.petitions.listPetitionRequests.useQuery({});

    const [params, setParams] = useQueryParams<{
        type: string;
        sort: string;
    }>();

    return (
        <>
            <div className="flex flex-col gap-4 max-w-screen-sm mx-auto pb-16 px-4">
                <h1 className="mt-12 my-5 text-3xl md:text-4xl">জনগণের দাবি</h1>
                <div className="flex items-center justify-between my-2">
                    <div>
                        <Tab type={'formalized'}>Formalized দাবিs</Tab>
                        <Tab type={'requests'}>সব দাবি</Tab>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="flex items-center gap-2 pb-1">
                                <span className="capitalize text-sm select-none">
                                    {`${params.sort}` === 'latest'
                                        ? 'Latest'
                                        : 'বেশি Votes'}
                                </span>
                                <RxCaretSort />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}>
                            <SortOption sort={'votes'}>বেশি Votes</SortOption>
                            <SortOption sort={'latest'}>Latest</SortOption>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <PetitionList />
            </div>
            <FloatingButtonSection />
        </>
    );
});

export default Home;
