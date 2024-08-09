import {z} from 'zod';

export const userSchema = z.object({
    name: z.string(),
    picture: z.string(),

    phone_number: z.string(),

    created_at: z.string().date(),
    updated_at: z.string().date(),
});

export type TUser = z.infer<typeof userSchema>;
