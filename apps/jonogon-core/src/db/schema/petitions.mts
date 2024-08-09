import {z} from 'zod';

export const petitionSchema = z.object({
    petitioner_id: z.string(),

    title: z.string().nullable(),
    details: z.string().nullable(),

    category: z.string().nullable(),

    // state information
    begun_escalation_at: z.string().date().nullable(),

    pinned_at: z.string().date().nullable(),
    pinned_by: z.string().nullable(),

    approved_at: z.string().date().nullable(),
    approved_by: z.string().nullable(),

    rejected_at: z.string().date().nullable(),
    rejected_by: z.string().nullable(),
    rejection_reason: z.string().nullable(),

    submitted_at: z.string().date().nullable(),

    created_at: z.string().date(),
    updated_at: z.string().date(),
});

export type TPetition = z.infer<typeof petitionSchema>;
