import {trpcVanilla} from '@/trpc/server';
import Petition from '@/app/petitions/[id]/_page';
import {generateDescription} from './_helpers';

export const runtime = 'edge';

export async function generateMetadata({params}: {params: {id: string}}) {
    const response = await trpcVanilla.petitions.get.query({id: params.id});
    const {
        id,
        title,
        description,
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

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:12003' : 'https://jonogon.org';
    const ogImageUrl = new URL(`${baseUrl}/api/og`);
    ogImageUrl.searchParams.append('petition_id', id);

    return {
        title: siteTitle,
        description: originalDescription,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: `https://jonogon.org/petitions/${id}`,
            type: 'website',
            siteName: 'jonogon.org',
            images: [
                {
                    url: ogImageUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: originalTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [ogImageUrl.toString()],
        },
    };
}

export default async function PetitionStatic() {
    return <Petition />;
}
