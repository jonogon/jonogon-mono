import {router} from '../index.mjs';
import {
    countAllComments,
    countRootComments,
    countReplies,
    createComment,
    deleteComment,
    listComments,
    listPublicComments,
    listReplies,
    updateComment,
} from '../procedures/jobabs/comments.mjs';
import {
    createJobab,
    getJobab,
    remove,
    updateJobab,
    softDeleteJobab,
    removeAttachment,
} from '../procedures/jobabs/crud.mjs';
import {getAllJobabs, listJobabs} from '../procedures/jobabs/listings.mjs';
import {
    clearVote,
    vote,
    commentVote,
    clearCommentVote,
} from '../procedures/jobabs/voting.mjs';

export const jobabRouter = router({
    // CRUD
    get: getJobab,
    create: createJobab,
    update: updateJobab,
    softDeleteJobab: softDeleteJobab,
    remove: remove,
    removeAttachment: removeAttachment,

    // listings
    list: listJobabs,
    getAllJobabs: getAllJobabs,

    // comments
    countAllComments: countAllComments,
    countRootComments: countRootComments,
    listComments: listComments,
    listPublicComments: listPublicComments,
    createComment: createComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    countReplies: countReplies,
    listReplies: listReplies,

    // voting
    vote: vote,
    clearVote: clearVote,
    commentVote: commentVote,
    clearCommentVote: clearCommentVote,
});
