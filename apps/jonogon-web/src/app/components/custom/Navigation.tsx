import {cn} from '@/app/lib/utils';
import {useStore, useStoreSetter} from '@/app/state/context';
import {trpc} from '@/app/trpc';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {observer} from 'mobx-react-lite';
import {useRef, useState} from 'react';
import {FiSearch} from 'react-icons/fi';
import {PiSignOutLight} from 'react-icons/pi';
import {useLocation} from 'wouter';
import {Button} from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuthState } from '@/app/auth/token-manager';

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
                onBlur={() =>
                    !store.filters.search && setOpenSearch(false)
                }
                onChange={(e) =>
                    setStore(
                        (store) =>
                            (store.filters.search = e.target.value),
                    )
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
})

const Navigation = observer(() => {
    const authState = useAuthState();
    const [location, navigate] = useLocation();
    const {mutateAsync: createPetition, isLoading} =
        trpc.petitions.create.useMutation();

    const handlePetitionCreate = async () => {
        const {
            data: {id: petitionId},
        } = await createPetition();
        console.log([petitionId]);
        navigate('petitions/' + petitionId + '/edit');
    };

    return (
        <div className="border-b border-neutral-200">
            <div className="container h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                    <img src="/images/icon.svg" alt="logo" className="w-7" />
                    <h2 className="text-2xl font-medium">jonogon</h2>
                </a>
                <div className="flex gap items-center">
                    <Search />
                    <Button
                        variant="link"
                        onClick={() => {
                            if (!authState) {
                                navigate('/login');
                                return;
                            }

                            if (location !== '/') {
                                navigate('/');
                                return;
                            }
                            else {
                                handlePetitionCreate()
                                return;
                            }    
                        }}>
                        {
                            !authState
                                ? 'Login to submit petition'
                                :location !== '/'
                                    ? 'Browse petitions'
                                    : 'Submit petition'
                        }
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="link" size="icon">
                                <Avatar>
                                    <AvatarImage
                                        className="w-7 h-7 rounded-full"
                                        src="https://github.com/shadcn.png"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}>
                            <DropdownMenuItem onSelect={() => console.log('Edit Profile')}>
                                Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => console.log('My Petitions')}>
                                My Petitions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center justify-between"
                                onSelect={() => console.log('s')}>
                                <span>Sign Out</span>
                                <PiSignOutLight />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
});

export default Navigation;
