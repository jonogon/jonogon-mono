import {useEffect, useState} from 'react';
import {NestedComment} from './types.mts';
import InputBox from './InputBox';
import {useParams} from 'wouter';
import {trpc} from '@/app/trpc';
import {treeify} from './utils.mts';

export default function Comment({comment}: {comment: NestedComment}) {
    const [comments, setComments] = useState<NestedComment[]>(
        comment.children ?? [],
    );

    const [enabled, setEnabled] = useState(false);
    const [inputOpened, setInputOpened] = useState(false);
    const [childrenExpanded, setChildrenExpanded] = useState(true);

    // define a trpc query here that only queries with current comment as parent
    const {petition_id} = useParams();
    const {data, refetch} = trpc.comments.list.useQuery(
        {
            petition_id: petition_id!!,
            parent_id: comment.id,
        },
        {
            enabled: enabled,
        },
    );

    const refetchChildren = () => {
        if (!enabled) {
            setEnabled(true);
        } else {
            refetch();
        }
    };

    useEffect(() => {
        const nestedChildren = treeify(data?.data ?? [], comment.id);
        setComments(nestedChildren);
    }, [data]);

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
                    <InputBox parentId={comment.id} refetch={refetchChildren} />
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
                        return <Comment comment={c} />;
                    })}
                </div>
            )}
        </div>
    );
}
