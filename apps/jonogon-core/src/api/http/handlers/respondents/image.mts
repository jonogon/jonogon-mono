import {TContextCreator} from '../../../trpc/context.mjs';
import sharp from 'sharp';
import {nanoid} from 'nanoid';
import {logger} from '../../../../logger.mjs';
import {Request, Response} from 'express';
import {z} from 'zod';
import {requireModeratorOrAdmin} from '../../../utility/auth-utils.js';

const querySchema = z.object({
    type: z.enum(['organization', 'expert']),
});

export function createRespondentImageHandler(createContext: TContextCreator) {
    return async (req: Request, res: Response) => {
        try {
            const ctx = await createContext({req, res});

            const queryParams = querySchema.safeParse(req.query);

            if (!queryParams.success) {
                return res.status(400).json({
                    message: 'query params were not sent correctly',
                    error: queryParams.error,
                });
            }

            if (!req.body) {
                return res.status(400).json({
                    message: 'file where?',
                });
            }

            // Check if user is moderator or admin
            requireModeratorOrAdmin(
                ctx,
                res,
                'only moderators can add images to respondents',
            );

            const fileName = nanoid();
            const imageKey = `respondent_${queryParams.data.type}_${fileName}.jpg`;
            const thumbnailKey = `respondent_${queryParams.data.type}_thumbnail_${fileName}.jpg`;

            // Process image in two sizes like petition attachments
            const imageStream = await sharp(req.body)
                .rotate()
                .resize(1024, 1024, {
                    fit: 'cover',
                    position: 'attention',
                })
                .jpeg()
                .toBuffer();

            const thumbnailStream = await sharp(req.body)
                .rotate()
                .resize(512, 512, {
                    fit: 'cover',
                    position: 'attention',
                })
                .jpeg()
                .toBuffer();

            // Store both sizes
            await Promise.all([
                ctx.services.fileStorage.storeFile(imageKey, imageStream),
                ctx.services.fileStorage.storeFile(
                    thumbnailKey,
                    thumbnailStream,
                ),
            ]);

            return res.json({
                message: 'image-uploaded',
                data: {
                    imageKey,
                    thumbnail_url:
                        await ctx.services.fileStorage.getFileURL(thumbnailKey),
                    image_url:
                        await ctx.services.fileStorage.getFileURL(imageKey),
                },
            });
        } catch (error) {
            logger.error('error uploading respondent image', error);
            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
                error,
            });
        }
    };
}
