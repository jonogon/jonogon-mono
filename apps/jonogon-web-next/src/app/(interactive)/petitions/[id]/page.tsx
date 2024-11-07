import {trpcVanilla} from '@/trpc/server';
import Petition from '@/app/(interactive)/petitions/[id]/_page';
import {generateDescription} from './_helpers';
import {getRequestContext} from '@cloudflare/next-on-pages';

export const runtime = 'edge';

const encoder = new TextEncoder();

export async function generateMetadata({params}: {params: {id: string}}) {
    const ctx = getRequestContext();

    const encodedSymmetricKeyString = encoder.encode(
        ctx.env.RENDERING_SYMMETRIC_KEY,
    );

    const signingKey = await crypto.subtle.importKey(
        'raw',
        encodedSymmetricKeyString,
        {name: 'HMAC', hash: 'SHA-256'},
        false,
        ['sign'],
    );

    const response = await trpcVanilla.petitions.get.query({id: params.id});

    const key = `${response.data.approved_at}`;
    const durableObjectKeyString = `https://jonogon.org/petitions/${params.id}/og-image;${key};1200;630`;

    const signature = await crypto.subtle.sign(
        'HMAC',
        signingKey,
        encoder.encode(durableObjectKeyString),
    );

    const signatureBase64 = Buffer.from(signature).toString('base64');

    const imageURL = new URL(`https://render.jonogon.org`);

    imageURL.searchParams.set(
        'url',
        `https://jonogon.org/petitions/${params.id}/og-image`,
    );

    imageURL.searchParams.set('key', key);
    imageURL.searchParams.set('w', `1200`);
    imageURL.searchParams.set('h', `630`);
    imageURL.searchParams.set('sign', signatureBase64);

    const {
        id,
        title,
        description,
        attachments,
        petition_upvote_count,
        petition_downvote_count,
    } = response.data;

    const totalVoteCount = petition_upvote_count + petition_downvote_count;

    const originalTitle = title ?? '';
    const originalDescription = description ?? '';
    const siteTitle =
        originalTitle.length > 64
            ? `${originalTitle.substring(0, 64)}... - Jonogon`
            : `${originalTitle} - Jonogon`;

    const metaTitle = title ?? '';
    const metaDescription = generateDescription(totalVoteCount);
    const imageAttachments = attachments.filter(
        (attachment) => attachment.type === 'image',
    );

    const metaImage = [
        {
            url: imageURL.toString(),
            width: 1200,
            height: 630,
            alt: originalTitle,
        },
    ];

    return {
        title: siteTitle,
        description: originalDescription,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: `https://jonogon.org/petitions/${id}`,
            type: 'website',
            siteName: 'jonogon.org',
            images: metaImage,
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: metaImage,
        },
    };
}

export default async function PetitionStatic() {
    return <Petition />;
}
