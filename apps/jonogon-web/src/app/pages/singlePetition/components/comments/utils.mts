import {Comment, NestedComment} from './types.mts';

export const treeify = (
    comments: Comment[],
    parentId?: string,
): NestedComment[] => {
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

    const addChildrenToMap = (comment: Comment) => {
        if (comment.parent_id && comment.parent_id != parentId) {
            commentMap[parentId!!].children.push(commentMap[comment.id]);
        }
    };

    comments.map(parentId ? addChildrenToMap : addCommentsToMap);

    const addCommentsToRoot = (comment: Comment) => {
        if (!comment.parent_id) {
            return commentMap[comment.id];
        }
    };
    const addChildrenToRoot = (comment: Comment) => {
        if (comment.parent_id == parentId) {
            return commentMap[comment.id];
        }
    };

    const rootComments = comments.map(
        parentId ? addChildrenToRoot : addCommentsToRoot,
    );

    return rootComments.filter((comment) => {
        return !!comment;
    });
};
