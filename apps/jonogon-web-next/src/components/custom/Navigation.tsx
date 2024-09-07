'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';
import {useEffect} from 'react';
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

const Navigation = () => {
    const router = useRouter();
    const isAuthenticated = useAuthState();

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
                <div className="flex gap items-center">
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
