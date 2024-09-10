import {publicProcedure} from '../../../index.mjs';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';

export const listPendingPetitionRequests = publicProcedure
    .input(
        z.object({
            page: z.number().default(0),
        }),
    )
    .query(async ({input, ctx}) => {
        if (!ctx.auth?.is_user_moderator) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'must-be-moderator',
            });
        }

        const query = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .innerJoin('users', 'users.id', 'petitions.created_by')
            .select([
                'petitions.id',
                'petitions.title',
                'petitions.submitted_at',
                'users.name',
            ])
            .where('petitions.approved_at', 'is', null)
            .where('petitions.rejected_at', 'is', null)
            .where('petitions.submitted_at', 'is not', null)
            .where('petitions.deleted_at', 'is', null)
            .orderBy('petitions.submitted_at', 'asc')
            .offset(input.page * 256)
            .limit(256)
            .execute();

        return {
            data: query,
        };
    });
