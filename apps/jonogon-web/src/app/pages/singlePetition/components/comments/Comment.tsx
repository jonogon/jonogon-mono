import {useEffect, useState} from 'react';
import {NestedComment} from './types.mts';
import InputBox from './InputBox';
import {useParams} from 'wouter';
import {trpc} from '@/app/trpc';
import {treeify} from './utils.mts';

export default function Comment({
    comment,
    refetch,
}: {
    comment: NestedComment;
    refetch: () => void;
}) {
    const [comments, setComments] = useState<NestedComment[]>(
        comment.children ?? [],
    );

    const [inputOpened, setInputOpened] = useState(false);
    const [childrenExpanded, setChildrenExpanded] = useState(true);

    useEffect(() => {
        setComments(comment?.children ?? []);
    }, [comment]);

    return (
        <div className="border-l px-6 mt-2">
            <p>{comment?.body}</p>
            <div className="flex flex-row text-sm gap-4 cursor-pointer my-1">
                <p
                    onClick={() => {
                        setInputOpened(true);
                    }}>
                    reply
                </p>
                {!!comments?.length &&
                    (childrenExpanded ? (
                        <p
                            onClick={() => {
                                setChildrenExpanded(false);
                            }}>
                            less
                        </p>
                    ) : (
                        <p
                            onClick={() => {
                                setChildrenExpanded(true);
                            }}>
                            more
                        </p>
                    ))}
            </div>

            {inputOpened && (
                <>
                    <InputBox parentId={comment.id} refetch={refetch} />
                    <button
                        className="px-4 border rounded"
                        onClick={() => {
                            setInputOpened(false);
                        }}>
                        Cancel
                    </button>
                </>
            )}
            {childrenExpanded && (
                <div>
                    {comments?.map((c) => {
                        return <Comment comment={c} refetch={refetch} />;
                    })}
                </div>
            )}
        </div>
    );
}
