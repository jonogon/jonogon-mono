import {Comment, NestedComment} from './types.mts';

export const treeify = (
    comments: Comment[],
    parentId?: string,
): NestedComment[] => {
    // Time complexity is O(3n) I think

    console.log(comments, 'entered treeify with these comments');
    console.log(comments);

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
