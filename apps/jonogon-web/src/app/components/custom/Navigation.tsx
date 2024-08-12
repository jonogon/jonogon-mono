import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {SearchIcon} from 'lucide-react';
import {Button} from '../ui/button';
import {useRef, useState} from 'react';
import {cn} from '@/app/lib/utils';

type TProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Navigation = ({search, setSearch}: TProps) => {
    const [openSearch, setOpenSearch] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="border-b border-neutral-200">
            <div className="max-w-[1200px] h-16 mx-auto flex items-center justify-between px-3">
                <a href="/" className="flex items-center gap-2">
                    <img src="/images/icon.svg" alt="logo" className="w-7" />
                    <h2 className="text-3xl font-medium">jonogon</h2>
                </a>
                <div className="flex gap-2 items-center">
                    <div>
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
                            onBlur={() => !search && setOpenSearch(false)}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Search "Petitions"'
                            className={cn(
                                'transition-all duration-300 w-0 pl-0 h-8 border-none outline-none rounded-md overflow-hidden',
                                {'w-44': openSearch},
                            )}
                        />
                    </div>
                    <Button variant="link">Start a petition</Button>
                    <Button variant="link" size="icon">
                        <Avatar>
                            <AvatarImage
                                className="w-7 h-7 rounded-full"
                                src="https://github.com/shadcn.png"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Navigation;
