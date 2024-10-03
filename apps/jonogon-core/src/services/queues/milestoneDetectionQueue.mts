import Queue from 'bull';
import {env} from '../../env.mjs';
import {TServices} from '../../services.mjs';
import {appRouter} from '../../api/trpc/routers/index.mjs';

export const milestoneDetectionQueue = new Queue<{}>(
    'milestone_detection_queue',
    env.REDIS_CONNECTION_URL,
);

export function processMilestoneDetectionQueue(services: TServices) {
    const caller = appRouter.createCaller({services});

    milestoneDetectionQueue.process(async (job) => {
        const firstPagePetitions = await caller.petitions.list({
            sort: 'votes',
            order: 'desc',
            filter: 'request',
            page: 0,
        });

        const top5 = firstPagePetitions.data.slice(0, 5);

        const topPetitionIDs = top5.map((petition) => `${petition.data.id}`);
        const topPetitionSet = new Set<string>(topPetitionIDs);

        const notifications = await services.postgresQueryBuilder
            .selectFrom('notifications')
            .select(['petition_id'])
            .where('type', '=', 'top')
            .where('petition_id', 'in', topPetitionIDs)
            .execute();

        notifications.forEach((notification) => {
            topPetitionSet.delete(`${notification.petition_id}`);
        });

        const nextNotifications = [...topPetitionSet]
            .map((petition_id) => {
                return top5.find(
                    (petition) => petition.data.id === petition_id,
                );
            })
            .filter((petition) => !!petition)
            .map((petition) => ({
                type: 'top',
                petition_id: petition.data.id,
                user_id: petition.data.created_by.id,
            }));

        await services.postgresQueryBuilder
            .insertInto('notifications')
            .values(nextNotifications)
            .returning(['id'])
            .execute();
    });
}
