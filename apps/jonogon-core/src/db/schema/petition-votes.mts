import {z} from 'zod';

export const petitionVote = z.object({
    petition_id: z.string(),
    voter_id: z.string(),

    vote: z.enum(['up', 'down']),

    nullified_at: z.string().date().optional(),
    updated_at: z.string().date(),
    created_at: z.string().date(),
});

export type TPetitionVote = z.infer<typeof petitionVote>;
