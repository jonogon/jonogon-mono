import {z} from 'zod';

export const petitionAttachment = z.object({
    petition_id: z.string(),
    commenter_id: z.string(),

    comment: z.string(),

    removed_at: z.string().date().nullable(),
    created_at: z.string().date(),
});

export type TPetitionAttachment = z.infer<typeof petitionAttachment>;
