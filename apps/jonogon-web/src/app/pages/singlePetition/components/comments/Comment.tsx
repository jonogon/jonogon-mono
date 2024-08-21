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
    const [totalVotes, setTotalVotes] = useState(0);
    const [childrenExpanded, setChildrenExpanded] = useState(true);
    const [liked, setLiked] = useState(false);

    const {mutateAsync: addLike} = trpc.comments.vote.useMutation();
    const {mutateAsync: removeLike} = trpc.comments.clearVote.useMutation();

    useEffect(() => {
        setComments(comment?.children ?? []);
        setTotalVotes(comment?.total_votes ?? 0);

        if (comment.user_vote) {
            setLiked(true);
        }
    }, [comment]);

    const likeComment = () => {
        setLiked(true);
        addLike({
            comment_id: comment.id,
            vote: 'up',
        });
        setTotalVotes(totalVotes + 1);
    };

    const unlikeComment = () => {
        setLiked(false);
        removeLike({
            comment_id: comment.id,
        });
        setTotalVotes(totalVotes - 1);
    };

    return (
        <div className="border-l px-6 mt-2">
            <p>{comment?.body}</p>
            <div className="flex flex-row text-sm gap-4 cursor-pointer my-1">
                <p>{totalVotes} likes</p>
                {liked ? (
                    <button className={'font-bold'} onClick={unlikeComment}>
                        liked
                    </button>
                ) : (
                    <button onClick={likeComment}>like</button>
                )}

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
