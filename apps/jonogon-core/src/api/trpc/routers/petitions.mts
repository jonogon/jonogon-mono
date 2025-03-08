import {router} from '../index.mjs';
import {
    approve,
    flag,
    formalize,
    reject,
    hold,
    adminPetitionList,
    createCategory,
    adminCategoryList,
    createAndolon,
    getAdminAndolonList,
    getAndolonPetitions,
    linkPetition,
} from '../procedures/petitions/moderation.mjs';
import {clearVote, vote} from '../procedures/petitions/voting.mjs';
import {
    createPetition,
    getPetition,
    remove,
    removeAttachment,
    submitPetition,
    updatePetition,
    softDeletePetition,
    getOgImageDetails,
} from '../procedures/petitions/crud.mjs';
import {
    listPetitions,
    listSuggestedPetitions,
    suggestSimilarPetitions,
} from '../procedures/petitions/listing/list-petitions.mjs';
import {listPendingPetitionRequests} from '../procedures/petitions/listing/pending-petition-requests.mjs';

export const petitionRouter = router({
    // CRUD
    list: listPetitions,
    listPendingPetitionRequests: listPendingPetitionRequests,
    listSuggestedPetitions: listSuggestedPetitions,

    get: getPetition,
    create: createPetition,

    getOgImageDetails: getOgImageDetails,

    update: updatePetition,
    submit: submitPetition,
    removeAttachment: removeAttachment,

    softDeletePetition: softDeletePetition,
    remove: remove,

    // Search Similar Petitions
    suggestSimilar: suggestSimilarPetitions,

    // Skibidi
    vote: vote,
    clearVote: clearVote,

    // Admin / Mod
    approve: approve,
    reject: reject,
    formalize: formalize,
    hold: hold,
    flag: flag,
    getPetitions: adminPetitionList,
    createCategory: createCategory,
    adminCategoryList: adminCategoryList,
    andolonList: getAdminAndolonList,
    andolonPetitions: getAndolonPetitions,
    createAndolon: createAndolon,
    linkPetition,
});
