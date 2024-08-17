import {router} from '../index.mjs';
import {
    approve,
    formalize,
    reject,
} from '../procedures/petitions/moderation.mjs';
import {clearVote, vote} from '../procedures/petitions/voting.mjs';
import {
    createPetition,
    getPetition,
    remove,
    removeAttachment,
    submitPetition,
    updatePetition,
} from '../procedures/petitions/crud.mjs';
import {listPetitions} from '../procedures/petitions/listing/list-petitions.mjs';
import {listPendingPetitionRequests} from '../procedures/petitions/listing/pending-petition-requests.mjs';

export const petitionRouter = router({
    // CRUD
    list: listPetitions,
    listPendingPetitionRequests: listPendingPetitionRequests,

    get: getPetition,
    create: createPetition,

    update: updatePetition,
    submit: submitPetition,
    removeAttachment: removeAttachment,

    remove: remove,

    // Skibidi
    vote: vote,
    clearVote: clearVote,

    // Admin / Mod
    approve: approve,
    reject: reject,
    formalize: formalize,
});
