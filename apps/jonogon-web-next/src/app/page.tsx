'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {RxCaretSort, RxCheck} from 'react-icons/rx';
import {PropsWithChildren} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {cn} from '@/lib/utils';
import PetitionList from '@/app/components/PetitionList';
import PetitionActionButton from '@/components/custom/PetitionActionButton';

function SortOption({
    sort,
    children,
}: PropsWithChildren<{sort: 'latest' | 'votes'}>) {
    const router = useRouter();
    const params = useSearchParams();

    const updateParams = () => {
        const nextSearchParams = new URLSearchParams(params);
        nextSearchParams.set('sort', sort);

        router.replace('/?' + nextSearchParams.toString());
    };

    return (
        <DropdownMenuItem
            className="capitalize flex items-center justify-between"
            onSelect={updateParams}>
            <span>{children}</span>
            {(params.get('sort') ?? 'votes') === sort ? <RxCheck /> : null}
        </DropdownMenuItem>
    );
}

function Tab({
    type,
    children,
}: PropsWithChildren<{type: 'requests' | 'formalized'}>) {
    const router = useRouter();
    const params = useSearchParams();

    const updateParams = () => {
        const nextSearchParams = new URLSearchParams(params);
        nextSearchParams.set('type', type);

        router.replace('/?' + nextSearchParams.toString());
    };

    return (
        <button
            className={cn(
                'border-b-2 border-transparent px-3 pb-1 capitalize select-none',
                {
                    'border-red-500 text-red-500':
                        (params.get('type') ?? 'requests') === type,
                },
            )}
            onClick={updateParams}>
            {children}
        </button>
    );
}

export default function Home() {
    const params = useSearchParams();

    return (
        <>
            <div className="flex flex-col gap-4 max-w-screen-sm mx-auto pb-16 px-4">
                <h1 className="mt-12 my-5 text-3xl md:text-4xl font-bold text-center text-red-500">
                    {params.get('type') === 'own' ? (
                        'Your Own দাবিs'
                    ) : (
                        <>
                            যত বেশি ভোট,
                            <br />
                            তত তাড়াতাড়ি জবাব
                        </>
                    )}
                </h1>
                <div className="flex items-center justify-between my-2">
                    {params.get('type') === 'own' ? null : (
                        <div>
                            <Tab type={'requests'}>সব দাবি</Tab>
                            <Tab type={'formalized'}>Formalized দাবিs</Tab>
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-2 pb-1">
                                <span className="capitalize text-sm select-none">
                                    {`${params.get('sort')}` === 'latest'
                                        ? 'Latest'
                                        : 'বেশি Votes'}
                                </span>
                                <RxCaretSort />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <SortOption sort={'votes'}>বেশি Votes</SortOption>
                            <SortOption sort={'latest'}>Latest</SortOption>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <PetitionList />
            </div>
            <div className="fixed bottom-0 left-0 w-full bg-background/50">
                <div
                    className={
                        'max-w-screen-sm w-full mx-auto flex flex-col py-4 px-8'
                    }>
                    <PetitionActionButton />
                </div>
            </div>
        </>
    );
}
