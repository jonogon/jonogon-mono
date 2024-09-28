import {router} from '../index.mjs';
import { userActivityLogProcedure } from '../procedures/activity/activity-log.mjs';

export const activityRouter = router({
    userActivityLog: userActivityLogProcedure,
});