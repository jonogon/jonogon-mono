import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {env} from '../../../../env.mjs';
import {hmac} from '../../../../lib/crypto/hmac.mjs';
import {TRPCError} from '@trpc/server';
import {getNumberOfAttempts} from './common.mjs';

export const MAX_OTP_REQUESTS_PER_HOUR = 4;

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

        const numberOfAttempts = await getNumberOfAttempts(
            ctx,
            `otp:${numberHash}:otp-requests`,
            3600,
        );

        if (
            env.NODE_ENV !== 'development' &&
            numberOfAttempts > MAX_OTP_REQUESTS_PER_HOUR
        ) {
            throw new TRPCError({
                code: 'TOO_MANY_REQUESTS',
                message: `You can only request ${MAX_OTP_REQUESTS_PER_HOUR + 1} OTPs for a number in one hour`,
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
