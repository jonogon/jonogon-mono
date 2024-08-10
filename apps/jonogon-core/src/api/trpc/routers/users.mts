import {router} from '../index.mjs';
import {z} from 'zod';
import {protectedProcedure} from '../middleware/protected.mjs';
import {TRPCError} from '@trpc/server';
import {deriveKey} from '../../../lib/crypto/keys.mjs';
import {env} from '../../../env.mjs';
import {decrypt} from '../../../lib/crypto/encryption.mjs';

export const userRouter = router({
    getSelf: protectedProcedure.query(async ({ctx}) => {
        const user = await ctx.services.postgresQueryBuilder
            .selectFrom('users')
            .select([
                'id',
                'name',
                'picture',
                'encrypted_phone_number',
                'phone_number_encryption_key_salt',
                'phone_number_encryption_iv',
            ])
            .where('id', '=', ctx.auth.user_id)
            .executeTakeFirst();

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'user not found',
            });
        }

        const salt = user.phone_number_encryption_key_salt;
        const iv = Buffer.from(user.phone_number_encryption_iv, 'base64');

        const key = await deriveKey(env.COMMON_ENCRYPTION_SECRET, salt);

        const decryptedPhoneNumber = decrypt(
            key,
            iv,
            user.encrypted_phone_number,
        );

        return {
            data: {
                id: user.id,
                name: user.name,
                picture: user.picture,

                phone: decryptedPhoneNumber,
            },
        };
    }),
    updateSelf: protectedProcedure
        .input(
            z.object({
                name: z.string().min(3).max(128),
            }),
        )
        .mutation(async ({ctx, input}) => {
            const user = await ctx.services.postgresQueryBuilder
                .updateTable('users')
                .set({
                    name: input.name,
                })
                .where('id', '=', ctx.auth.user_id)
                .executeTakeFirst();

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'user not found',
                });
            }

            return {
                input,
                message: 'updated',
            };
        }),
});
