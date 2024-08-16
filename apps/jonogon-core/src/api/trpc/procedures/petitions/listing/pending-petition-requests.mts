import {publicProcedure} from '../../../index.mjs';
import {z} from 'zod';
import {scope} from 'scope-utilities';
import {TRPCError} from '@trpc/server';
import {pick} from 'es-toolkit';
import {deriveStatus} from '../../../../../db/model-utils/petition.mjs';

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
            .orderBy('petitions.submitted_at', 'asc')
            .offset(input.page * 32)
            .limit(32)
            .execute();

        return {
            data: query,
        };
    });
