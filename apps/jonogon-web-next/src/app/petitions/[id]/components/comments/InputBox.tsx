import {trpc} from '@/trpc';
import {useParams} from 'next/navigation';
import {RefObject, useEffect, useRef, useState} from 'react';
import {CommentInterface} from './types';

export default function InputBox({
    setInputOpened,
    replyBtnSignal,
    parentId,
    tag,
    optimisticSetter,
}: {
    setInputOpened: (x: boolean) => void;
    replyBtnSignal: boolean;
    parentId: string;
    tag: string;
    optimisticSetter: (x: CommentInterface) => void;
}) {
    const [inputValue, setInputValue] = useState('');
    const replyInputRef = useRef<HTMLTextAreaElement>(null);

    const {id: petition_id} = useParams<{id: string}>();

    const createCommentMutation = trpc.comments.create.useMutation();

    const createComment = async () => {
        const newReply = await createCommentMutation.mutateAsync({
            petition_id: petition_id,
            body: inputValue,
            parent_id: parentId,
        });

        if (newReply.data) {
            const reply = {
                id: newReply.data.id!!,
                total_votes: 0,
                created_by: newReply.data.created_by!!,
                body: newReply.data.body!!,
                deleted_at: null,
                highlighted_at: null,
                username: newReply.data.username!!,
                user_vote: 0,
                profile_picture: newReply.data.profile_picture,
            };

            optimisticSetter(reply);
            setInputValue('');
            setInputOpened(false);
        }
    };

    const scroll = () => {
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
                    setInputValue(tag);
                } else {
                    requestAnimationFrame(checkIfScrollFinished);
                }
            };
            requestAnimationFrame(checkIfScrollFinished);
        }
    };

    useEffect(() => {
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
                <p
                    className="p-2 border bg-green-600 text-white rounded-full text-sm cursor-pointer px-4"
                    onClick={() => {
                        createComment();
                    }}>
                    Comment
                </p>
            </div>
        </div>
    );
}
