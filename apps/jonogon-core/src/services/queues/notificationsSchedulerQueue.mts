import Queue from 'bull';
import {env} from '../../env.mjs';
import {TServices} from '../../services.mjs';
import {smsNotificationDispatchQueue} from './smsNotificationDispatchQueue.mjs';

export const notificationsSchedulerQueue = new Queue<{}>(
    'notification_aggregator_queue',
    env.REDIS_CONNECTION_URL,
);

export function processNotificationsSchedulerQueue(services: TServices) {
    notificationsSchedulerQueue.process(async (job) => {
        const result = await services.postgresQueryBuilder
            .selectFrom('notifications')
            .select('user_id')
            .distinct()
            .where(
                'created_at',
                '>=',
                new Date(Date.now() - 24 * 60 * 60 * 1000),
            )
            .execute();

        await smsNotificationDispatchQueue.addBulk(
            result.map((result) => ({
                data: {
                    user_id: result.user_id,
                },
            })),
        );
    });
}
