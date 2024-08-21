import {useEffect, useState} from 'react';
import {NestedComment} from './types.js';
import {useParams} from 'next/navigation';
import {trpc} from '@/trpc';
import InputBox from './InputBox';
import Comment from './Comment';
import {treeify} from './utils.js';

export default function CommentThread() {
    const {petition_id} = useParams() as {petition_id: string};
    const {data, refetch} = trpc.comments.list.useQuery({
        petition_id: petition_id,
    });

    const [comments, setComments] = useState<NestedComment[]>([]);

    useEffect(() => {
        const nestedComments = treeify(data?.data ?? []);
        setComments(nestedComments?.length ? nestedComments : []);
    }, [data]);

    return (
        <>
            <div>
                <InputBox parentId={undefined} refetch={refetch} />
                {comments.map((comment) => {
                    return <Comment comment={comment} refetch={refetch} />;
                })}
            </div>
        </>
    );
}
