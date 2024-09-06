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
        attachments,
    } = response.data;

    const originalTitle = title ?? '';
    const originalDescription = description ?? '';
    const siteTitle =
        originalTitle.length > 64
            ? `${originalTitle.substring(0, 64)}... - Jonogon`
            : `${originalTitle} - Jonogon`;

    const totalVoteCount = petition_upvote_count + petition_downvote_count;
    const metaTitle = title ?? '';
    const metaDescription = generateDescription(totalVoteCount);

    return {
        title: siteTitle,
        description: originalDescription,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: `https://jonogon.org/petitions/${id}`,
            type: 'website',
            siteName: 'jonogon.org',
            images:
                attachments.length > 0
                    ? [
                          {
                              url: 'https://static.jonogon.org/attachment_thumbnail_i725qf3XqN6PNw39A0Uh4.jpg',
                              // url: `https://jonogon.org${attachments[0].thumbnail}`,
                              width: 1200,
                              height: 630,
                              alt: originalTitle,
                          },
                      ]
                    : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images:
                attachments.length > 0
                    ? [
                          'https://static.jonogon.org/attachment_thumbnail_i725qf3XqN6PNw39A0Uh4.jpg',
                      ]
                    : [],
        },
    };
}

export default async function PetitionStatic() {
    return <Petition />;
}
