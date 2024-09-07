import {router} from '../index.mjs';
import {
    countComments,
    countReplies,
    createComment,
    deleteComment,
    listComments,
    listReplies,
} from '../procedures/comments/crud.mjs';
import {clearVote, vote} from '../procedures/comments/voting.mjs';

export const commentRouter = router({
    count: countComments,
    list: listComments,

    countReplies: countReplies,
    listReplies: listReplies,

    create: createComment,
    delete: deleteComment,

    vote: vote,
    clearVote: clearVote,
});
