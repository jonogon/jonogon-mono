import {TContextCreator} from '../../../trpc/context.mjs';
import sharp from 'sharp';
import {nanoid} from 'nanoid';
import {logger} from '../../../../logger.mjs';
import {Request, Response} from 'express';
import {z} from 'zod';
import { requireAuth, requireModeratorOrAdmin } from '../../../utility/auth-utils.js';

export function createJobabAttachmentHandler(createContext: TContextCreator) {
    return async (req: Request, res: Response) => {
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

            if (!req.body) {
                return res.status(400).json({
                    message: 'file where?',
                });
            }

            // check if the user is logged in
            requireAuth(ctx, res, 'must be logged in to upload attachments');

            // Check if user is moderator or admin
            requireModeratorOrAdmin(ctx, res, 'only moderators can add attachments to jobabs');

            const jobab = await ctx.services.postgresQueryBuilder
                .selectFrom('jobabs')
                .selectAll()
                .where('id', '=', req.params.id)
                .where('deleted_at', 'is', null)
                .executeTakeFirst();

            if (!jobab) {
                return res.status(404).json({
                    message: 'jobab not found',
                });
            }

            const fileName = nanoid();

            if (queryParams.data.type === 'image') {
                const imageKey = `jobab_attachment_${fileName}.jpg`;
                const thumbnailKey = `jobab_attachment_thumbnail_${fileName}.jpg`;

                const imageStream = await sharp(req.body)
                    .rotate()
                    .resize(1960)
                    .jpeg()
                    .toBuffer();

                const thumbnailStream = await sharp(req.body)
                    .rotate()
                    .resize(512)
                    .jpeg()
                    .toBuffer();

                await Promise.all([
                    ctx.services.fileStorage.storeFile(imageKey, imageStream),
                    ctx.services.fileStorage.storeFile(
                        thumbnailKey,
                        thumbnailStream,
                    ),
                ]);

                const result = await ctx.services.postgresQueryBuilder
                    .insertInto('jobab_attachments')
                    .values({
                        jobab_id: req.params.id,
                        filename: queryParams.data.filename,
                        attachment: imageKey,
                    })
                    .returning(['id'])
                    .executeTakeFirst();

                return res.json({
                    message: 'image-added',
                    data: {
                        attachment_id: result?.id,
                        url: await ctx.services.fileStorage.getFileURL(imageKey),
                    },
                });
            } else {
                const ext = queryParams.data.filename.split('.').pop();
                const fileKey = `jobab_attachment_${fileName}.${ext}`;

                await ctx.services.fileStorage.storeFile(fileKey, req.body);

                const result = await ctx.services.postgresQueryBuilder
                    .insertInto('jobab_attachments')
                    .values({
                        jobab_id: req.params.id,
                        filename: queryParams.data.filename,
                        attachment: fileKey,
                    })
                    .returning(['id'])
                    .executeTakeFirst();

                return res.json({
                    message: 'attachment-added',
                    data: {
                        attachment_id: result?.id,
                        url: await ctx.services.fileStorage.getFileURL(fileKey),
                    },
                });
            }
        } catch (error) {
            logger.error('error uploading jobab attachment', {error});

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
            });
        }
    };
} 