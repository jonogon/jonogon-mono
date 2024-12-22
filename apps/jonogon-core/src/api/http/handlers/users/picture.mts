import {TContextCreator} from '../../../trpc/context.mjs';
import sharp from 'sharp';
import {nanoid} from 'nanoid';
import {logger} from '../../../../logger.mjs';
import {Request, Response} from 'express';
import {env} from '../../../../env.mjs';
import {requireAuth} from '../../../utility/auth-utils.js';

export function createProfilePictureHandler(createContext: TContextCreator) {
    return async (req: Request, res: Response) => {
        try {
            const ctx = await createContext({req, res});

            // check if user is logged in
            requireAuth(ctx, res, 'must be logged in to set a profile picture');

            if (!req.body) {
                return res.status(400).json({
                    message: 'file where?',
                });
            }

            const stream = await sharp(req.body)
                .rotate()
                .resize(512, 512, {
                    fit: 'cover',
                    position: 'attention',
                })
                .jpeg()
                .toBuffer();

            const fileName = nanoid();
            const fileKey = `profile-picture_${fileName}.jpg`;

            await ctx.services.fileStorage.storeFile(fileKey, stream);

            await ctx.services.postgresQueryBuilder
                .updateTable('users')
                .set({
                    picture: fileKey,
                })
                .where('id', '=', `${ctx.auth!.user_id}`)
                .executeTakeFirst();

            if (env.NODE_ENV === 'development') {
                // stalling as dev is too fast
                await new Promise((resolve) => {
                    setTimeout(resolve, 5_000);
                });
            }

            return res.json({
                message: 'profile picture has been set',
                data: {
                    fileURL: await ctx.services.fileStorage.getFileURL(fileKey),
                },
            });
        } catch (error) {
            logger.error('error uploading attachment', error);

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
            });
        }
    };
}
