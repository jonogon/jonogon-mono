import {TContextCreator} from '../../../trpc/context.mjs';
import sharp from 'sharp';
import {nanoid} from 'nanoid';
import {logger} from '../../../../logger.mjs';
import {Request, Response} from 'express';
import {z} from 'zod';
import {requireAuth} from '../../../utility/auth-utils.js';

export function createPetitionAttachmentHandler(
    createContext: TContextCreator,
) {
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
            requireAuth(ctx, res, 'must be logged in to set a profile picture');

            const petition = await ctx.services.postgresQueryBuilder
                .selectFrom('petitions')
                .selectAll()
                .where('id', '=', req.params.id)
                .executeTakeFirst();

            if (!petition) {
                return res.status(404).json({
                    message: 'petition not found',
                });
            }

            if (
                `${petition.created_by}` !== `${ctx.auth?.user_id}` &&
                !ctx.auth!.is_user_admin
            ) {
                return res.status(403).json({
                    message: 'you are not the creator of this petition',
                });
            }
            

            const fileName = nanoid();

            if (queryParams.data.type === 'image') {
                const imageKey = `attachment_${fileName}.jpg`;
                const thumbnailKey = `attachment_thumbnail_${fileName}.jpg`;

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
                    .insertInto('petition_attachments')
                    .values({
                        petition_id: req.params.id,
                        is_image: true,
                        filename: queryParams.data.filename,
                        thumbnail: thumbnailKey,
                        attachment: imageKey,
                    })
                    .returning(['id'])
                    .executeTakeFirst();

                return res.json({
                    message: 'image-added',
                    data: {
                        attachment_id: result?.id,
                        thumbnail_url:
                            await ctx.services.fileStorage.getFileURL(
                                thumbnailKey,
                            ),
                        image_url:
                            await ctx.services.fileStorage.getFileURL(imageKey),
                    },
                });
            } else {
                const ext = queryParams.data.filename.split('.').pop();
                const fileKey = `attachment_${fileName}.${ext}`;

                await ctx.services.fileStorage.storeFile(fileKey, req.body);

                const result = await ctx.services.postgresQueryBuilder
                    .insertInto('petition_attachments')
                    .values({
                        petition_id: req.params.id,
                        is_image: false,
                        filename: queryParams.data.filename,
                        attachment: fileKey,
                    })
                    .returning(['id'])
                    .executeTakeFirst();

                return res.json({
                    message: 'attachment-added',
                    data: {
                        attachment_id: result?.id,
                        file_url:
                            await ctx.services.fileStorage.getFileURL(fileKey),
                    },
                });
            }
        } catch (error) {
            logger.error('error uploading attachment', {error});

            res.status(500).json({
                message: 'INTERNAL SERVER ERROR',
            });
        }
    };
}
