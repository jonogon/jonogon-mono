import {z} from 'zod';

export const petitionImage = z.object({
    petition_id: z.string(),
    image_url: z.string(),

    removed_at: z.string().date().nullable(),
    created_at: z.string().date(),
});

export type TPetitionImage = z.infer<typeof petitionImage>;
