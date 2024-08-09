import {z} from 'zod';

export const petitionAttachment = z.object({
    petition_id: z.string(),

    file_extension: z.string(),
    file_url: z.string(),

    removed_at: z.string().nullable(),
    created_at: z.string().date(),
});

export type TPetitionAttachment = z.infer<typeof petitionAttachment>;
