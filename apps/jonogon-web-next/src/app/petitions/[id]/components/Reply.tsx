import {AiOutlineLike} from 'react-icons/ai';
import {GoReply} from 'react-icons/go';

export default function Reply({
    setInputOpen,
    replyBtnSignal,
    setReplyBtnSignal,
    scroll,
}: {
    setInputOpen: (x: boolean) => void;
    replyBtnSignal: boolean;
    setReplyBtnSignal: (x: boolean) => void;
    scroll: () => void;
}) {
    return (
        <div className="flex flex-col gap-1 my-2">
            <div className="flex flex-row gap-1 items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 border"></div>
                <div className="flex flex-row gap-1 items-center">
                    <p>@imtiaz</p>
                </div>
            </div>
            <p className="">@arafat no. i will not hehe</p>
            <div className="flex flex-row text-sm justify-between items-center">
                <div className="flex flex-row gap-2">
                    <p>77 likes</p>
                </div>
                <div className="flex flex-row gap-3 items-center justify-center h-full">
                    <p className="flex flex-row gap-1 items-center cursor-pointer">
                        <AiOutlineLike size={16} />
                        Like
                    </p>
                    <p
                        className="flex flex-row gap-1 items-center cursor-pointer"
                        onClick={() => {
                            setInputOpen(true);
                            setReplyBtnSignal(!replyBtnSignal);
                            scroll();
                        }}>
                        <GoReply />
                        Reply
                    </p>
                </div>
            </div>
        </div>
    );
}
