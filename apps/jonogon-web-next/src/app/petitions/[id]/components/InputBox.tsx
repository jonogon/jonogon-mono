import {RefObject, useEffect, useRef, useState} from 'react';

export default function InputBox({
    setInputOpened,
    replyBtnSignal,
    tag,
}: {
    setInputOpened: (x: boolean) => void;
    replyBtnSignal: boolean;
    tag?: string;
}) {
    const [inputValue, setInputValue] = useState('');
    const replyInputRef = useRef<HTMLTextAreaElement>(null);

    const scroll = () => {
        console.log('inside scroll');
        if (replyInputRef.current) {
            const textareaBottom =
                replyInputRef.current.offsetTop +
                replyInputRef.current.offsetHeight;
            const offsetBottom = textareaBottom - window.innerHeight + 200;
            window.scrollTo({
                behavior: 'smooth',
                top: Math.min(
                    offsetBottom,
                    document.documentElement.scrollHeight - window.innerHeight,
                ),
            });
            const checkIfScrollFinished = () => {
                const currentScroll = window.pageYOffset;

                if (
                    Math.abs(currentScroll - offsetBottom) <= 1 ||
                    currentScroll >=
                        document.documentElement.scrollHeight -
                            window.innerHeight
                ) {
                    replyInputRef.current?.focus();
                    setInputValue(tag ? tag : '@imtiaz ');
                } else {
                    requestAnimationFrame(checkIfScrollFinished);
                }
            };
            requestAnimationFrame(checkIfScrollFinished);
        }
    };

    useEffect(() => {
        console.log('in the useEffect');
        scroll();
    }, [replyBtnSignal]);

    return (
        <div className="w-full border bg-white rounded-lg">
            <textarea
                className="w-full p-4 rounded-lg focus:outline-none"
                ref={replyInputRef}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
            />
            <div className="flex gap-2 justify-end p-2">
                <p
                    className="p-2 border bg-none rounded-full text-sm cursor-pointer px-4"
                    onClick={() => {
                        setInputOpened(false);
                    }}>
                    Cancel
                </p>
                <p className="p-2 border bg-green-600 text-white rounded-full text-sm cursor-pointer px-4">
                    Comment
                </p>
            </div>
        </div>
    );
}
