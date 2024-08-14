import {TContextCreator} from '../../../trpc/context.mjs';
import sharp from 'sharp';
import {nanoid} from 'nanoid';
import {logger} from '../../../../logger.mjs';
import {Request, Response} from 'express';

export function createProfilePictureHandler(createContext: TContextCreator) {
    return async (req: Request, res: Response) => {
        try {
            const ctx = await createContext({req, res});

            if (!ctx.auth?.user_id) {
                return res.status(401).json({
                    message: 'must be logged in to set a profile picture',
                });
            }

            if (!req.body) {
                return res.status(400).json({
                    message: 'file where?',
                });
            }

            const stream = sharp(req.body)
                .resize(512, 512, {
                    fit: 'cover',
                    position: 'attention',
                })
                .jpeg();

            const fileName = nanoid();
            const fileKey = `profile-picture_${fileName}.jpg`;

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
            logger.error('error uploading attachment', error);

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
            });
        }
    };
}
