import Queue from 'bull';
import {env} from '../../env.mjs';
import {TServices} from '../../services.mjs';
import {groupBy, countBy} from 'es-toolkit';
import {decrypt} from '../../lib/crypto/encryption.mjs';
import {deriveKey} from '../../lib/crypto/keys.mjs';

export const smsNotificationDispatchQueue = new Queue<{user_id: string}>(
    'sms_notification_dispatch_queue',
    {
        redis: env.REDIS_CONNECTION_URL,
        limiter: {
            max: 120,
            duration: 60_000,
        },
    },
);

export function processSmsNotificationDispatchQueue(services: TServices) {
    smsNotificationDispatchQueue.process(async (job) => {
        const user = await services.postgresQueryBuilder
            .selectFrom('users')
            .select([
                'id',
                'phone_number_encryption_iv',
                'phone_number_encryption_key_salt',
                'encrypted_phone_number',
            ])
            .where('id', '=', job.data.user_id)
            .executeTakeFirst();

        if (!user) {
            return;
        }

        const result = await services.postgresQueryBuilder
            .selectFrom('notifications')
            .where('user_id', '=', job.data.user_id)
            .where('actor_user_id', '<>', job.data.user_id)
            .selectAll()
            .execute();

        const grouped = groupBy(result, (item) => item.type);

        // PETITION COMMENTS
        const postCommentIDs = new Set<string>();

        for (const notification of grouped.comment ?? []) {
            if (notification.comment_id) {
                postCommentIDs.add(notification.comment_id);
            }
        }

        for (const notification of grouped.reply_to_someones_comment ?? []) {
            if (notification.reply_comment_id) {
                postCommentIDs.add(notification.reply_comment_id);
            }
        }

        const petitionCommentCount = postCommentIDs.size;

        // COMMENT REPLIES
        const commentReplyIDs = new Set<string>();

        for (const notification of grouped.reply ?? []) {
            if (notification.reply_comment_id) {
                commentReplyIDs.add(notification.reply_comment_id);
            }
        }

        const commentReplyCount = commentReplyIDs.size;

        // COMMENT VOTES
        const commentVoteIDs = new Set<string>();

        for (const notification of grouped.reply_vote ?? []) {
            if (notification.comment_vote_id) {
                commentVoteIDs.add(notification.comment_vote_id);
            }
        }

        for (const notification of grouped.comment_vote ?? []) {
            if (notification.comment_vote_id) {
                commentVoteIDs.add(notification.comment_vote_id);
            }
        }

        const commentVoteCount = commentVoteIDs.size;

        // PETITION VOTES
        const petitionVoteIDs = new Set<string>();

        for (const notification of grouped.vote ?? []) {
            if (notification.vote_id) {
                petitionVoteIDs.add(notification.vote_id);
            }
        }

        const petitionVoteCount = petitionVoteIDs.size;

        // PETITION MODERATION
        const petitionStatus: {
            [petition_id: string]: 'approved' | 'rejected' | 'formalized';
        } = {};

        for (const notification of grouped.petition_approved ?? []) {
            if (notification.petition_id) {
                petitionStatus[notification.petition_id] = 'approved';
            }
        }

        for (const notification of grouped.petition_rejected ?? []) {
            if (notification.petition_id) {
                petitionStatus[notification.petition_id] = 'rejected';
            }
        }

        for (const notification of grouped.petition_formalized ?? []) {
            if (notification.petition_id) {
                petitionStatus[notification.petition_id] = 'formalized';
            }
        }

        const petitionStatusCounts = countBy(
            Object.values(petitionStatus),
            (item) => item,
        );

        const approvedPetitionCount = petitionStatusCounts.approved ?? 0;
        const rejectedPetitionCount = petitionStatusCounts.rejected ?? 0;
        const formalizedPetitionCount = petitionStatusCounts.formalized ?? 0;

        // PETITION MILESTONES
        const topPetitionIDs = new Set<string>();

        for (const notification of grouped.top ?? []) {
            if (notification.petition_id) {
                topPetitionIDs.add(notification.petition_id);
            }
        }

        const topPetitionCount = topPetitionIDs.size;

        let message = `Your https://jonogon.org in the last 24 hours:\n`;

        if (topPetitionCount > 0) {
            if (topPetitionCount === 1) {
                message += '- 1 petition is in top 5\n';
            } else {
                message += `- ${topPetitionCount} petitions are top 5\n`;
            }
        }

        if (petitionVoteCount > 0) {
            if (petitionVoteCount === 1) {
                message += '- 1 vote on a petition\n';
            } else {
                message += `- ${petitionVoteCount} votes on your petitions\n`;
            }
        }

        if (petitionCommentCount > 0) {
            if (petitionCommentCount === 1) {
                message += '- 1 new comment on a petition\n';
            } else {
                message += `- ${petitionCommentCount} new comments across your petitions\n`;
            }
        }

        if (commentReplyCount > 0) {
            if (commentReplyCount === 1) {
                message += '- 1 reply to a comment\n';
            } else {
                message += `- ${commentReplyCount} replies to your comments\n`;
            }
        }

        if (commentVoteCount > 0) {
            if (commentVoteCount === 1) {
                message += '- 1 vote on a comment\n';
            } else {
                message += `- ${commentVoteCount} votes on your comments\n`;
            }
        }

        if (approvedPetitionCount > 0) {
            if (approvedPetitionCount === 1) {
                message += '- 1 petition was approved\n';
            } else {
                message += `- ${approvedPetitionCount} petitions were approved\n`;
            }
        }

        if (rejectedPetitionCount > 0) {
            if (rejectedPetitionCount === 1) {
                message += '- 1 petition was rejected\n';
            } else {
                message += `- ${rejectedPetitionCount} petitions were rejected\n`;
            }
        }

        if (formalizedPetitionCount > 0) {
            if (formalizedPetitionCount === 1) {
                message += '- 1 petition was formalized\n';
            } else {
                message += `- ${formalizedPetitionCount} petitions were formalized\n`;
            }
        }

        const key = await deriveKey(
            env.COMMON_ENCRYPTION_SECRET,
            user.phone_number_encryption_key_salt,
        );

        const iv = Buffer.from(user.phone_number_encryption_iv, 'base64');
        const number = decrypt(key, iv, user.encrypted_phone_number);

        await services.smsService.sendSMS(number, message);
    });
}
