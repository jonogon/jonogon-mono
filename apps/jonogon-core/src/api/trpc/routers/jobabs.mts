import {router} from '../index.mjs';
import {
    countAllComments,
    countComments,
    countReplies,
    createComment,
    deleteComment,
    listComments,
    listPublicComments,
    listPublicReplies,
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
import {listJobabs} from '../procedures/jobabs/listings.mjs';
import { clearVote, vote } from '../procedures/jobabs/voting.mjs';

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

    // comments
    listComments: listComments,
    listPublicComments: listPublicComments,
    createComment: createComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    countAllComments: countAllComments,
    countComments: countComments,
    countReplies: countReplies,
    listPublicReplies: listPublicReplies,
    listReplies: listReplies,

    // voting
    vote: vote,
    clearVote: clearVote,
});
