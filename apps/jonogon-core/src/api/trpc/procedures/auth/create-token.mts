import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {hmac} from '../../../../lib/crypto/hmac.mjs';
import {env} from '../../../../env.mjs';
import {TRPCError} from '@trpc/server';
import {returnOf, scope} from 'scope-utilities';
import {generateSalt} from '../../../../lib/crypto/salt.mjs';
import {generateIV} from '../../../../lib/crypto/iv.mjs';
import {deriveKey} from '../../../../lib/crypto/keys.mjs';
import {encrypt} from '../../../../lib/crypto/encryption.mjs';
import jwt from 'jsonwebtoken';
import {pick} from 'es-toolkit';
import {getNumberOfAttempts} from './common.mjs';
import {MAX_OTP_REQUESTS_PER_HOUR} from './request-otp.mjs';
import {firebaseAuth} from '../../../../services/firebase/index.mjs';

export const MAX_LOGIN_ATTEMPTS_PER_HOUR = MAX_OTP_REQUESTS_PER_HOUR * 4;

export const createTokenProcedure = publicProcedure
    .input(
        z.object({
            phoneNumber: z.string().regex(/^\+8801[0-9]{9}$/g),
            otp: z.string().regex(/^[0-9]{4}$/g),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const numberHash = await hmac(
            input.phoneNumber,
            env.COMMON_HMAC_SECRET,
        );

        const numberOfAttempts = await getNumberOfAttempts(
            ctx,
            `otp:${numberHash}:attempted-auth`,
            3600,
        );

        if (
            env.NODE_ENV !== 'development' &&
            numberOfAttempts > MAX_LOGIN_ATTEMPTS_PER_HOUR
        ) {
            throw new TRPCError({
                code: 'TOO_MANY_REQUESTS',
                message: `You can only attempt to log in ${MAX_LOGIN_ATTEMPTS_PER_HOUR} times in one hour`,
            });
        }

        const storedOTPHash = await ctx.services.redisConnection.get(
            `otp:${numberHash}`,
        );

        const otpHash = await hmac(input.otp, env.COMMON_HMAC_SECRET);

        if (storedOTPHash !== otpHash) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'invalid-otp' as const,
            });
        }

        const user = await scope(
            await ctx.services.postgresQueryBuilder
                .selectFrom('users')
                .select(['id', 'name', 'picture', 'is_mod', 'is_admin'])
                .where('phone_number_hmac', '=', numberHash)
                .executeTakeFirst(),
        ).let(async (user) => {
            return (
                user ??
                (await returnOf(async () => {
                    // we're kinda serious about not storing
                    // the password in plain text.

                    const salt = generateSalt();
                    const iv = generateIV();

                    const key = await deriveKey(
                        env.COMMON_ENCRYPTION_SECRET,
                        salt,
                    );

                    const encryptedPhoneNumber = encrypt(
                        key,
                        iv,
                        input.phoneNumber,
                    );

                    const result = await ctx.services.postgresQueryBuilder
                        .insertInto('users')
                        .values({
                            phone_number_hmac: numberHash,
                            encrypted_phone_number: encryptedPhoneNumber,
                            phone_number_encryption_key_salt: salt,
                            phone_number_encryption_iv: iv.toString('base64'),
                            updated_at: new Date(),
                        })
                        .returning([
                            'id',
                            'name',
                            'picture',
                            'is_mod',
                            'is_admin',
                        ])
                        .executeTakeFirst();

                    if (!result) {
                        throw new Error('error creating user');
                    }

                    return result;
                }))
            );
        });

        const token = await firebaseAuth.createCustomToken(user.id.toString(), {
            is_admin: user.is_admin,
            is_mod: user.is_mod,
        });

        return {
            firebase_custom_token: token,
        };
    });
