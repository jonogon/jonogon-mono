import {router} from '../index.mjs';
import {
    createJobab,
    getJobab,
    remove,
    updateJobab,
    softDeleteJobab,
    removeAttachment,
} from '../procedures/jobabs/crud.mjs';
import { listJobabs } from '../procedures/jobabs/listings.mjs';

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
});
