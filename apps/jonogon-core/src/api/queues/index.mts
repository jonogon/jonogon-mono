import {milestoneDetectionQueue} from '../../services/queues/milestoneDetectionQueue.mjs';
import {notificationsSchedulerQueue} from '../../services/queues/notificationsSchedulerQueue.mjs';

export async function initQueues() {
    await milestoneDetectionQueue.add(
        {},
        {
            jobId: 'detect-milestone',
            repeat: {
                // 6pm every day
                cron: '0 18 * * *',
            },
        },
    );

    await notificationsSchedulerQueue.add(
        {},
        {
            jobId: 'aggregate-notifications',
            repeat: {
                // 8pm every day
                cron: '0 20 * * *',
            },
        },
    );
}
