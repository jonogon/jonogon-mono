import {trpc} from '@/app/trpc';
import {Link} from 'wouter';

export default function ModPage() {
    const {data: pendingPetitionRequestResponse} =
        trpc.petitions.listPendingPetitionRequests.useQuery({page: 0});

    return (
        <div className={'max-w-screen-sm mx-auto py-16 px-4'}>
            <h1 className={'text-3xl font-regular text-stone-600 leading-0'}>
                Petition Requests That Need Moderation
            </h1>
            <div>
                {pendingPetitionRequestResponse?.data.map((petition, i) => {
                    return (
                        <Link
                            key={petition.id}
                            href={`/petitions/${petition.id}`}
                            className={
                                'block text-xl font-medium py-4 underline'
                            }>
                            [{i + 1}]: "{petition.title}" - {petition.name}
                        </Link>
                    );
                }) ?? []}
            </div>
        </div>
    );
}
