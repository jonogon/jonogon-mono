import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {env} from '../../../../env.mjs';
import {hmac} from '../../../../lib/crypto/hmac.mjs';
import {TRPCError} from '@trpc/server';

export const requestOTPProcedure = publicProcedure
    .input(
        z.object({
            phoneNumber: z.string().regex(/^\+8801[0-9]{9}$/g),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const otp =
            env.NODE_ENV === 'development' &&
            input.phoneNumber === '+8801111111111'
                ? '1111'
                : Math.round(Math.random() * 9_999)
                      .toString()
                      .padStart(4, '0');

        const numberHash = await hmac(
            input.phoneNumber,
            env.COMMON_HMAC_SECRET,
        );

        const numberOfAttempts = (await ctx.services.redisConnection.eval(
            // this is lua code
            `
                local current
                current = redis.call("incr", KEYS[1])
                
                -- only run the expire command on first run
                if current == 1 then
                    -- expire the key after 1 hour
                    redis.call("expire", KEYS[1], 3600)
                end
                
                return current
            `,
            1,
            `otp:${numberHash}:otp-requests`,
        )) as number;

        if (numberOfAttempts > 5) {
            throw new TRPCError({
                code: 'TOO_MANY_REQUESTS',
                message: 'You can only request 5 OTPs for a number in one hour',
            });
        }

        const otpHash = await hmac(otp, env.COMMON_HMAC_SECRET);

        await ctx.services.redisConnection.setex(
            `otp:${numberHash}`,
            300, // expire in 5 minutes
            otpHash,
        );

        await ctx.services.smsService.sendSMS(
            input.phoneNumber,
            `Your Jonogon Login OTP is ${otp}`,
        );

        return {
            input,
            message: `otp-sent` as const,
        };
    });
