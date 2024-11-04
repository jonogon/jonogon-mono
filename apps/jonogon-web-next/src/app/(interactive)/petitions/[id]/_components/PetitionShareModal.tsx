import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from '@/components/ui/dialog';
import {useSocialShareStore} from '@/store/useSocialShareStore';

import Image from 'next/image';
import {set} from 'zod';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function PetitionShareModal({isOpen, setIsOpen}: Props) {
    const {openShareModal} = useSocialShareStore();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="flex flex-col items-center justify-center w-5/6 sm:max-w-[400px] !rounded-xl">
                <DialogHeader>
                    <Image
                        src="/images/icon.svg"
                        alt="logo"
                        width={75}
                        height={75}
                    />
                </DialogHeader>

                <DialogDescription className="text-center text-red-500 leading-tight">
                    <p className="text-xl font-bold">Congratulations</p>
                    <p className="text-lg font-semibold leading-tight">
                        You are now officially a দাবিদার!
                    </p>
                </DialogDescription>

                <DialogFooter className="w-full">
                    <Button
                        type="submit"
                        variant={'outline'}
                        onClick={() => {
                            setIsOpen(false);
                            setTimeout(() => {
                                openShareModal();
                            }, 250);
                        }}
                        className="text-2xl py-6 w-full rounded-lg">
                        <p className="font-bold mr-1.5">Share</p> দাবি
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
