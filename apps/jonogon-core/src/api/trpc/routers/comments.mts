import {router} from '../index.mjs';
import {
    createComment,
    deleteComment,
    listComments,
} from '../procedures/comments/crud.mjs';
import {clearVote, vote} from '../procedures/comments/voting.mjs';

export const commentRouter = router({
    list: listComments,
    create: createComment,
    delete: deleteComment,

    vote: vote,
    clearVote: clearVote,
});
