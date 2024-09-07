import {trpcVanilla} from '@/trpc/server';
import Petition from '@/app/petitions/[id]/_page';

export const runtime = 'edge';

export default async function PetitionStatic({params}: {params: {id: string}}) {
    const response = await trpcVanilla.petitions.get.query({id: params.id});
    const originalTitle = response.data.title ?? '';

    const title =
        originalTitle.length > 64
            ? `${originalTitle.substring(0, 64)}... - Jonogon`
            : `${originalTitle} - Jonogon`;

    return (
        <>
            <title>{title}</title>
            <Petition />
        </>
    );
}
