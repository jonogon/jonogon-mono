import {cn} from '@/app/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {SearchIcon} from 'lucide-react';
import {useRef, useState} from 'react';
import {PiSignOutLight} from 'react-icons/pi';
import {Button} from '../ui/button';
import {observer} from 'mobx-react-lite';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {useLocation} from 'wouter';
import {useStore, useStoreSetter} from '@/app/state/context';
import {trpc} from '@/app/trpc';

const Navigation = observer(() => {
    const store = useStore();
    const setStore = useStoreSetter();
    const [openSearch, setOpenSearch] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [location, navigate] = useLocation();
    const {mutateAsync: createPetition, isLoading} =
        trpc.petitions.create.useMutation();

    const handlePetitionCreate = async () => {
        const {
            data: {id: petitionId},
        } = await createPetition();
        console.log([petitionId]);
        navigate('petitions/' + petitionId);
    };

    return (
        <div className="border-b border-neutral-200">
            <div className="container h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2">
                    <img src="/images/icon.svg" alt="logo" className="w-7" />
                    <h2 className="text-3xl font-medium">jonogon</h2>
                </a>
                <div className="flex gap items-center">
                    <div className="flex items-center">
                        <Button
                            variant="link"
                            size="icon"
                            onClick={() => {
                                setOpenSearch(true);
                                inputRef.current?.focus();
                            }}>
                            <SearchIcon size={18} />
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
                    <Button
                        variant="link"
                        onClick={() =>
                            location !== '/'
                                ? navigate('/')
                                : handlePetitionCreate()
                        }>
                        {location !== '/'
                            ? 'Browse petitions'
                            : 'Start a petition'}
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
                            <DropdownMenuItem onSelect={() => console.log('s')}>
                                Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => console.log('s')}>
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
