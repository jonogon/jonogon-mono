import {Comment, NestedComment} from './types.js';

export const treeify = (comments: Comment[]): NestedComment[] => {
    // Time complexity is O(3n) I think
    const entries = comments.map((comment) => [
        comment.id,
        {...comment, children: []},
    ]);
    const commentMap = Object.fromEntries(entries);

    const addCommentsToMap = (comment: Comment) => {
        if (comment.parent_id) {
            commentMap[comment.parent_id].children.push(commentMap[comment.id]);
        }
    };

    comments.map(addCommentsToMap);

    const addCommentsToRoot = (comment: Comment) => {
        if (!comment.parent_id) {
            return commentMap[comment.id];
        }
    };

    const rootComments = comments.map(addCommentsToRoot);

    return rootComments.filter((comment) => {
        return !!comment;
    });
};
