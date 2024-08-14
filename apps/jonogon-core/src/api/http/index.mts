import express, {type Express} from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import {TContextCreator} from '../trpc/context.mjs';
import {appRouter} from '../trpc/routers/index.mjs';
import {env} from '../../env.mjs';
import {z} from 'zod';
import {logger} from '../../logger.mjs';
import sharp from 'sharp';
import {nanoid} from 'nanoid';

export async function registerHTTPRoutes(
    expressApp: Express,
    createContext: TContextCreator,
) {
    const app = expressApp;

    app.get('/', (req, res) => {
        res.json({
            message: 'HELLO FROM jonogon-core!',
        });
    });

    app.use(
        '/trpc',
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        }),
    );

    app.post('/petitions/:id/attachments', async (req, res) => {
        try {
            const ctx = await createContext({req, res});

            const queryParams = z
                .object({
                    filename: z.string(),
                    type: z.enum(['image', 'file']),
                })
                .safeParse(req.query);

            if (!queryParams.success) {
                return res.status(400).json({
                    message: 'query params were not sent correctly',
                    error: queryParams.error,
                });
            }

            // if it is image, compress the file then save it
            // if it is file, just save it
        } catch (error) {
            logger.error('error uploading attachment', {error});

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
            });
        }
    });

    app.put('/users/self/picture', async (req, res) => {
        try {
            const ctx = await createContext({req, res});

            if (!ctx.auth?.user_id) {
                return res.status(401).json({
                    message: 'must be logged in to set a profile picture',
                });
            }

            const stream = sharp(req.body)
                .resize(512, 512, {
                    fit: 'cover',
                    position: 'attention',
                })
                .jpeg();

            const fileName = nanoid();
            const fileKey = `profile-pictures/${fileName}.jpg`;

            await ctx.services.fileStorage.storeFile(fileKey, stream);

            await ctx.services.postgresQueryBuilder
                .updateTable('users')
                .set({
                    picture: fileKey,
                })
                .executeTakeFirst();

            return res.json({
                message: 'profile picture has been set',
                data: {
                    fileURL: await ctx.services.fileStorage.getFileURL(fileKey),
                },
            });
        } catch (error) {
            logger.error('error uploading attachment', {error});

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
            });
        }
    });

    if (env.NODE_ENV === 'development') {
        app.use('/static/', express.static('/jonogon-static/'));

        const trpcPlayground = await import('trpc-playground/handlers/express');

        app.use(
            '/trpc-playground',
            await trpcPlayground.expressHandler({
                trpcApiEndpoint: '/trpc',
                playgroundEndpoint: '/trpc-playground',
                router: appRouter,
            }),
        );
    }
}
