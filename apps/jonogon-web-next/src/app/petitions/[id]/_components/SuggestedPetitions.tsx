import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import {Button} from '@/components/ui/button';
import {trpc} from '@/trpc/client';
import {
    HandThumbDownIcon as ThumbsDownIconOutline,
    HandThumbUpIcon as ThumbsUpIconOutline,
} from '@heroicons/react/24/outline';
import React from 'react';
import {useRouter} from 'next/navigation';

interface Props {
    location: string;
    target: string;
    petitionId: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuggestedPetitions = ({
    location,
    target,
    petitionId,
    isOpen,
    setIsOpen,
}: Props) => {
    const {data: suggestedPetitions, isLoading} =
        trpc.petitions.listSuggestedPetitions.useQuery({
            location,
            target,
            petitionId,
        });

    const router = useRouter();

    return (
        <>
            {!isLoading &&
                suggestedPetitions &&
                suggestedPetitions?.data?.length > 0 && (
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetContent
                            side="bottom"
                            className="max-w-screen-sm mx-auto !rounded-t-2xl ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                            <SheetHeader>
                                <SheetTitle className="text-red-500 text-left">
                                    Checkout other দাবি's that might interest
                                    you
                                </SheetTitle>
                                <SheetDescription>
                                    <div className="max-h-[275px] pr-4 overflow-y-auto mt-2">
                                        {suggestedPetitions.data.map(
                                            (petition) => (
                                                <div
                                                    className="[&:not(:last-child)]:border-b border-zinc-200 "
                                                    key={petition.id}
                                                    onClick={() =>
                                                        router.push(
                                                            `/petitions/${petition.id}`,
                                                        )
                                                    }>
                                                    <div className="flex items-start justify-between gap-3 sm:gap-4 py-4  cursor-pointer">
                                                        {/* For Attachments */}
                                                        {petition.attachments && (
                                                            <div className="size-20 min-w-20 object-cover">
                                                                <img
                                                                    src={`${
                                                                        petition.attachments
                                                                    }`.replace(
                                                                        '$CORE_HOSTNAME',
                                                                        window
                                                                            .location
                                                                            .hostname,
                                                                    )}
                                                                    className="w-full h-full object-cover bg-red-500"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 h-20 flex flex-col justify-between">
                                                            <h3 className="text-black font-medium text-lg leading-snug mb-3 line-clamp-2 text-left">
                                                                {petition.title}
                                                            </h3>
                                                            <div className="flex items-center gap-6">
                                                                <div className="flex items-center gap-2">
                                                                    <ThumbsUpIconOutline className="size-5 text-green-500" />
                                                                    <p className="font-semibold">
                                                                        {
                                                                            petition.upvotes
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <ThumbsDownIconOutline className="size-5 text-red-500" />
                                                                    <p className="font-semibold">
                                                                        {
                                                                            petition.downvotes
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size={'sm'}
                                                            variant={'outline'}
                                                            className="hidden sm:flex">
                                                            Vote
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                )}
        </>
    );
};

export default SuggestedPetitions;
