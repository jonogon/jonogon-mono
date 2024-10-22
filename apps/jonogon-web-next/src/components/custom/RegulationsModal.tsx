import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RegulationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const RegulationsModal: React.FC<RegulationsModalProps> = ({
    isOpen,
    onClose,
    onAccept,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="flex flex-col justify-center items-center w-full max-w-[600px] px-2 sm:px-8 py-10 rounded-lg border-4 border-[#EF4335] bg-[#F7F2ED] sm:max-h-[90vh] sm:overflow-y-auto"
                closeButton={false}
            >
                <div className="self-stretch flex-col justify-start items-center gap-6 inline-flex">
                    <div className="w-full justify-center items-center inline-flex">
                        <h2 className="text-black text-xl sm:text-2xl font-['Inter'] font-bold text-center leading-normal">Rules & regulations for filing দাবিs</h2>
                    </div>
                    <div className="w-full flex-col justify-start items-start gap-6 self-stretch inline-flex">
                        <div className="flex flex-col justify-start items-start gap-6">
                            {[
                                { title: "No bullying", description: "Keep interactions constructive. Intimidation or harassment of any kind is not tolerated." },
                                { title: "No Hate Speech", description: "Express your views respectfully. Language that promotes hatred against individuals or groups is prohibited." },
                                { title: "No Discrimination", description: "Treat everyone equally. Discrimination based on race, gender, religion, or any other characteristic is unacceptable." },
                                { title: "No Profanity", description: "Maintain a civil tone. Use of offensive language or explicit content is not allowed." },
                                { title: "No Racism", description: "Embrace diversity. Racist comments or content promoting racial superiority are strictly forbidden." }
                            ].map((rule, index) => (
                                <div key={index} className="flex items-center gap-3 sm:gap-5">
                                    <div className="flex w-6 h-6 sm:w-8 sm:h-8 p-2 sm:p-3 justify-center items-center rounded-full bg-[#EF4335] text-white text-xs sm:text-sm font-semibold font-['Inter']">
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                        <h3 className="text-black text-base sm:text-lg font-semibold font-['Inter']">{rule.title}</h3>
                                        <p className="text-[#696969] text-xs sm:text-sm font-light font-['Inter']">{rule.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-start gap-4 self-stretch">
                            <button
                                onClick={onAccept}
                                className="flex h-10 sm:h-12 p-2 justify-center items-center gap-2 self-stretch rounded-lg bg-[#EF4335] cursor-pointer hover:bg-[#D93A2D] transition-colors"
                            >
                                <span className="text-white text-lg sm:text-xl font-bold font-['Inter']">Accept</span>
                            </button>
                            <p className="text-[#5B5B5B] font-['Inter'] text-xs sm:text-sm font-normal leading-normal">
                                By accepting our rules and regulations you're accepting our <a href="https://elvista.notion.site/Jonogon-962f56d9d6ea42d3839790c2146b7f6a" target="_blank" className="text-[#312C2C] font-['Inter'] text-xs sm:text-sm font-normal leading-normal underline">Terms & Conditions</a> for behaving and acting accordingly in our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RegulationsModal;
