'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {useEffect, useState} from 'react';
import {PiSignOutLight} from 'react-icons/pi';
import {buttonVariants} from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {useAuthState} from '@/auth/token-manager';
import {trpc} from '@/trpc/client';
import Link from 'next/link';

import {useRouter} from 'next/navigation';
import {signOut} from 'firebase/auth';
import {firebaseAuth} from '@/firebase';
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon';
import {Dialog, DialogClose, DialogContent, DialogTrigger} from '../ui/dialog';
import About from './About';
import {DialogTitle} from '@radix-ui/react-dialog';
import {X} from 'lucide-react';

const Navigation = () => {
    const router = useRouter();
    const isAuthenticated = useAuthState();
    const [aboutModalOpen, setAboutModealOpen] = useState(false);

    const {data: selfDataResponse} = trpc.users.getSelf.useQuery(undefined, {
        enabled: !!isAuthenticated,
    });

    const id = parseInt(`${selfDataResponse?.data.id ?? '0'}`);

    useEffect(() => {
        if (selfDataResponse?.data.name === null) {
            router.replace('/profile/edit');
        }
    }, [selfDataResponse?.data.name]);

    return (
        <div className="border-b border-neutral-300 fixed w-full top-0 left-0 z-[50] bg-background">
            <nav className="max-w-screen-sm mx-auto h-20 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/images/icon.svg" alt="logo" className="w-12" />
                    <div className={'flex flex-col -space-y-2'}>
                        <span className="text-3xl font-black">জনগণ</span>
                        <span className="text-neutral-600">
                            সবার দাবির প্লাটফর্ম
                        </span>
                    </div>
                </Link>
                <div className="flex gap-4 items-center">
                    <Dialog
                        open={aboutModalOpen}
                        onOpenChange={setAboutModealOpen}>
                        <DialogTrigger asChild>
                            <QuestionMarkCircleIcon
                                className={`w-8 h-8 text-red-500`}
                            />
                        </DialogTrigger>
                        <DialogContent className="bg-red-500 border-none w-full md:w-11/12 max-w-none overflow-y-auto max-h-[100vh] ">
                            <DialogTitle className="text-2xl font-medium text-white">
                                About Us
                            </DialogTitle>
                            <About setOpen={setAboutModealOpen} />
                        </DialogContent>
                    </Dialog>
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className="rounded-full overflow-hidden">
                                    <AvatarImage
                                        className={
                                            'border-4 rounded-full w-12 h-12'
                                        }
                                        src={(
                                            selfDataResponse?.data
                                                .picture_url ??
                                            `https://static.jonogon.org/placeholder-images/${((id + 1) % 11) + 1}.jpg`
                                        ).replace(
                                            '$CORE_HOSTNAME',
                                            window.location.hostname,
                                        )}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                onCloseAutoFocus={(e) => e.preventDefault()}>
                                <DropdownMenuItem
                                    onSelect={() => {
                                        router.push('/profile/edit');
                                    }}>
                                    Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => {
                                        router.push('/?type=own');
                                    }}>
                                    My Petitions
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center justify-between"
                                    onSelect={async () => {
                                        await signOut(firebaseAuth());

                                        router.push('/');
                                    }}>
                                    <span>Sign Out</span>
                                    <PiSignOutLight />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : isAuthenticated === false ? (
                        <>
                            <Link
                                className={buttonVariants({
                                    variant: 'default',
                                })}
                                href={'/login'}>
                                Login
                            </Link>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
