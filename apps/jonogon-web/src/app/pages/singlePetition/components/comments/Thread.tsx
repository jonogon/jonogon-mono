import {useEffect, useState} from 'react';
import {NestedComment} from './types.mts';
import {useParams} from 'wouter';
import {trpc} from '@/app/trpc';
import InputBox from './InputBox';
import Comment from './Comment';
import {treeify} from './utils.mts';

export default function CommentThread() {
    const {petition_id} = useParams();
    const {data, refetch} = trpc.comments.list.useQuery({
        petition_id: petition_id!!,
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
                    return <Comment comment={comment} />;
                })}
            </div>
        </>
    );
}
