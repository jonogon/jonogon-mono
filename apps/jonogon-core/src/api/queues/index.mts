import {milestoneDetectionQueue} from '../../services/queues/milestoneDetectionQueue.mjs';
import {notificationsSchedulerQueue} from '../../services/queues/notificationsSchedulerQueue.mjs';

export async function initQueues() {
    await milestoneDetectionQueue.add(
        {},
        {
            jobId: 'detect-milestone',
            repeat: {
                // 6pm every day (GMT+6)
                cron: '0 12 * * *',
            },
        },
    );

    await notificationsSchedulerQueue.add(
        {},
        {
            jobId: 'aggregate-notifications',
            repeat: {
                // 8pm every day (GMT+6)
                cron: '0 14 * * *',
            },
        },
    );
}
