'use client';

import {Input} from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {useSocialShareStore} from '@/store/useSocialShareStore';
import {Check, ClipboardIcon} from 'lucide-react';
import {useState} from 'react';
import {
    FacebookIcon,
    FacebookShareButton,
    XIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    TelegramIcon,
    TelegramShareButton,
    RedditIcon,
    RedditShareButton,
    LinkedinIcon,
    LinkedinShareButton,
} from 'react-share';

export function SocialShareSheet() {
    const currentUrl = new URL(window.location.href);
    const petitionLink = currentUrl.origin + currentUrl.pathname;

    const {isOpen, closeShareModal} = useSocialShareStore();

    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(petitionLink).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={closeShareModal}>
            <SheetContent
                side="bottom"
                className="max-w-screen-sm mx-auto !rounded-t-2xl ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                <SheetHeader>
                    <SheetTitle className="text-red-500 ">
                        Share দাবি !
                    </SheetTitle>
                    <SheetDescription>
                        <div className="relative">
                            <Input
                                readOnly
                                value={petitionLink}
                                className="border-red-300 border-2 rounded-xl"
                            />
                            <div
                                className="absolute top-1/2 right-2 -translate-y-1/2 shadow-xl cursor-pointer"
                                onClick={handleCopy}>
                                {isCopied ? (
                                    <Check className="size-4 text-green-700" />
                                ) : (
                                    <ClipboardIcon className="size-4" />
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                            <FacebookShareButton url={petitionLink}>
                                <FacebookIcon size={30} borderRadius={16} />
                            </FacebookShareButton>

                            <TwitterShareButton url={petitionLink}>
                                <XIcon size={30} borderRadius={16} />
                            </TwitterShareButton>

                            <WhatsappShareButton url={petitionLink}>
                                <WhatsappIcon size={30} borderRadius={16} />
                            </WhatsappShareButton>

                            <TelegramShareButton url={petitionLink}>
                                <TelegramIcon size={30} borderRadius={16} />
                            </TelegramShareButton>

                            <RedditShareButton url={petitionLink}>
                                <RedditIcon size={30} borderRadius={16} />
                            </RedditShareButton>

                            <LinkedinShareButton url={petitionLink}>
                                <LinkedinIcon size={30} borderRadius={16} />
                            </LinkedinShareButton>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
