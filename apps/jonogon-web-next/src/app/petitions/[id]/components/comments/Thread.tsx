import {useEffect, useState} from 'react';
import {CommentThreadProps, NestedComment} from './types.js';
import {useParams} from 'next/navigation';
import {trpc} from '@/trpc';
import InputBox from './InputBox';
import Comment from './Comment';

export const treeify = (comments: NestedComment[]): NestedComment[] => {
    // Time complexity is O(3n) I think
    const entries = comments.map((comment) => [
        comment.id,
        {...comment, children: []},
    ]);
    const commentMap = Object.fromEntries(entries);

    const addCommentsToMap = (comment: NestedComment) => {
        if (comment.parent_id) {
            commentMap[comment.parent_id].children.push(commentMap[comment.id]);
        }
    };

    comments.map(addCommentsToMap);

    const addCommentsToRoot = (comment: NestedComment) => {
        if (!comment.parent_id) {
            return commentMap[comment.id];
        }
    };

    const rootComments = comments.map(addCommentsToRoot);

    return rootComments.filter((comment) => {
        return !!comment;
    });
};

export function CommentThread({
    comments,
    refetch,
    inputRef,
}: CommentThreadProps) {
    return (
        <>
            <div>
                {comments.map((comment) => {
                    return (
                        <Comment
                            comment={comment}
                            refetch={refetch}
                            key={comment.id}
                            inputRef={inputRef}
                        />
                    );
                })}
            </div>
        </>
    );
}
