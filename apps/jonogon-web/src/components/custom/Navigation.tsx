import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {Button} from '../ui/button';
import {SearchIcon} from 'lucide-react';

export default function Navigation() {
    return (
        <div className="flex w-full  p-4 justify-between">
            <div>
                <img src="/images/logo.svg" alt="logo" className="w-full" />
            </div>
            <div className="flex gap-4 items-center">
                <SearchIcon size={18} />
                <Button>Submit your petition</Button>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            className="w-6 h-6 rounded-full"
                            src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>Username</span>
                </div>
            </div>
        </div>
    );
}
