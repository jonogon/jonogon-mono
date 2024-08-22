import {LegacyRef, useState, useRef} from 'react';
import {InputProps} from './types.js';
import {useParams} from 'next/navigation';
import {trpc} from '@/trpc';
import {AiOutlineSend} from 'react-icons/ai';

export default function InputBox({
    refetch,
    inputRef,
    focusedCommentId,
    setFocusedCommentId,
}: InputProps) {
    const [inputBody, setInputBody] = useState('');
    // const inputRef = useRef<HTMLInputElement>(null);

    const {id} = useParams() as {id: string};

    const createComment = trpc.comments.create.useMutation();

    const onEnter = async () => {
        await createComment.mutateAsync({
            body: inputBody,
            petition_id: id,
            parent_id: focusedCommentId == '' ? undefined : focusedCommentId,
        });
        setInputBody('');
        setFocusedCommentId('');
        refetch();
    };

    return (
        <div className="py-2 w-full">
            <div className="flex flex-row gap-1 items-center">
                <input
                    className="flex-grow p-4 rounded-full"
                    value={inputBody}
                    onChange={(event) => setInputBody(event.target.value)}
                    onKeyDown={(event) => {
                        event.key == 'Enter' ? onEnter() : null;
                    }}
                    placeholder="Leave a comment"
                    ref={inputRef}
                />
                <AiOutlineSend
                    size={24}
                    color="#4a4239"
                    className="mx-1 cursor-pointer"
                    onClick={onEnter}
                />
            </div>
        </div>
    );
}
