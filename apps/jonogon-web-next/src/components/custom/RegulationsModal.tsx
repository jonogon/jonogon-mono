import React, {useState, useEffect} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';

interface RegulationsModalProps {
    onClose: () => void;
    onAccept: () => void;
    shouldShow?: boolean;
}

const RegulationsModal: React.FC<RegulationsModalProps> = ({
    onClose,
    onAccept,
    shouldShow = false,
}: RegulationsModalProps) => {
    const [isOpen, setIsOpen] = useState(shouldShow);

    useEffect(() => {
        setIsOpen(shouldShow);
    }, [shouldShow]);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const handleAccept = () => {
        setIsOpen(false);
        onAccept();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="w-full max-w-[600px] max-h-full px-2 py-10 border-4 border-[#EF4335] bg-[#F7F2ED] !rounded-2xl overflow-y-auto"
                closeButton={false}>
                <div className="md:max-h-[calc(90vh-50px)] sm:max-h-[100vh] px-4 overflow-y-auto">
                    <DialogHeader className="mb-8 mt-2">
                        <DialogTitle className="text-black text-xl sm:text-2xl font-['Inter'] font-bold text-center leading-normal">
                            Rules & regulations for filing দাবিs
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        {[
                            {
                                title: 'No bullying',
                                description:
                                    'Keep interactions constructive. Intimidation or harassment of any kind is not tolerated.',
                            },
                            {
                                title: 'No Hate Speech',
                                description:
                                    'Express your views respectfully. Language that promotes hatred against individuals or groups is prohibited.',
                            },
                            {
                                title: 'No Discrimination',
                                description:
                                    'Treat everyone equally. Discrimination based on race, gender, religion, or any other characteristic is unacceptable.',
                            },
                            {
                                title: 'No Profanity',
                                description:
                                    'Maintain a civil tone. Use of offensive language or explicit content is not allowed.',
                            },
                            {
                                title: 'No Racism',
                                description:
                                    'Embrace diversity. Racist comments or content promoting racial superiority are strictly forbidden.',
                            },
                        ].map((rule, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 sm:gap-5 mb-6">
                                <div className="flex w-4 h-4 p-3 justify-center items-center rounded-full bg-[#EF4335] text-white text-xs sm:text-sm font-semibold font-['Inter']">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-black text-base sm:text-lg font-semibold font-['Inter'] mb-1">
                                        {rule.title}
                                    </h3>
                                    <DialogDescription className="text-[#696969] text-xs sm:text-sm font-light font-['Inter']">
                                        {rule.description}
                                    </DialogDescription>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sticky bottom-0 bg-[#F7F2ED] pt-2">
                        <Button
                            onClick={onAccept}
                            className="w-full p-6 mb-4 rounded-lg bg-[#EF4335] hover:bg-[#D93A2D] transition-colors">
                            <span className="text-white text-lg sm:text-xl font-bold font-['Inter']">
                                Accept
                            </span>
                        </Button>
                        <p className="text-[#5B5B5B] font-['Inter'] text-xs sm:text-sm font-normal leading-normal">
                            By accepting our rules and regulations you&apos;re
                            accepting our{' '}
                            <a
                                href="https://elvista.notion.site/Jonogon-962f56d9d6ea42d3839790c2146b7f6a"
                                target="_blank"
                                className="text-[#312C2C] font-['Inter'] text-xs sm:text-sm font-normal leading-normal underline">
                                Terms & Conditions
                            </a>{' '}
                            for behaving and acting accordingly in our platform.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RegulationsModal;
