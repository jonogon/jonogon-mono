import {cn} from '@/app/lib/utils';
import {useStore, useStoreSetter} from '@/app/state/context';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {observer} from 'mobx-react-lite';
import {useRef, useState} from 'react';
import {FiSearch} from 'react-icons/fi';
import {PiSignOutLight} from 'react-icons/pi';
import {Button, buttonVariants} from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {useAuthState} from '@/app/auth/token-manager.tsx';
import {Link} from 'wouter';
import {trpc} from '@/app/trpc';

const Search = observer(() => {
    const store = useStore();
    const setStore = useStoreSetter();
    const [openSearch, setOpenSearch] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex items-center">
            <Button
                variant="link"
                size="icon"
                onClick={() => {
                    setOpenSearch(true);
                    inputRef.current?.focus();
                }}>
                <FiSearch size={18} />
            </Button>
            <input
                ref={inputRef}
                type="text"
                onBlur={() => !store.filters.search && setOpenSearch(false)}
                onChange={(e) =>
                    setStore((store) => (store.filters.search = e.target.value))
                }
                value={store.filters.search}
                placeholder='Search "Petitions"'
                className={cn(
                    'transition-all duration-300 w-0 pl-0 h-8 border-none outline-none rounded-md overflow-hidden',
                    {'w-44': openSearch},
                )}
            />
        </div>
    );
});

const Navigation = observer(() => {
    const isAuthenticated = useAuthState();

    const {data: selfData} = trpc.users.getSelf.useQuery(undefined, {
        enabled: !!isAuthenticated,
    });

    return (
        <div className="border-b border-neutral-300 fixed w-full top-0 left-0 z-[10] bg-background">
            <nav className="max-w-screen-sm mx-auto h-20 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/images/icon.svg" alt="logo" className="w-8" />
                    <div className={'flex flex-col -space-y-2'}>
                        <span className="text-3xl font-black">জনগণ</span>
                        <span className="text-neutral-600">
                            আমাদের দাবির প্লাটফর্ম
                        </span>
                    </div>
                </Link>
                <div className="flex gap items-center">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="link" size="icon">
                                    <Avatar className="rounded-full overflow-hidden">
                                        <AvatarImage src="https://github.com/omranjamal.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                onCloseAutoFocus={(e) => e.preventDefault()}>
                                <DropdownMenuItem
                                    onSelect={() =>
                                        console.log('Edit Profile')
                                    }>
                                    Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() =>
                                        console.log('My Petitions')
                                    }>
                                    My Petitions
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center justify-between"
                                    onSelect={() => console.log('Sign Ou')}>
                                    <span>Sign Out</span>
                                    <PiSignOutLight />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link
                                className={buttonVariants({
                                    variant: 'default',
                                })}
                                href={'/login'}>
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
});

export default Navigation;
