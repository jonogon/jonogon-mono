import {trpc} from '@/app/trpc';
import {useParams} from 'wouter';
import Markdown from 'react-markdown';
import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {ImageCarousel} from './components/ImageCarousel';
import {Button} from '@/app/components/ui/button';
import {useEffect, useState} from 'react';
import {useAuthState} from '@/app/auth/token-manager.tsx';

const SinglePetition = () => {
    const isAuthenticated = useAuthState();

    const {petition_id} = useParams();

    const {data: petition, refetch} = trpc.petitions.get.useQuery({
        id: petition_id!!,
    });

    const [userVote, setUserVote] = useState(0);

    useEffect(() => {
        if (petition) {
            setUserVote(petition?.extras.user_vote ?? 0);
        }
    }, [petition]);

    const thumbsUpMutation = trpc.petitions.vote.useMutation();
    const thumbsDownMutation = trpc.petitions.vote.useMutation();
    const clearVoteMutation = trpc.petitions.clearVote.useMutation();

    const clickThumbsUp = async () => {
        if (userVote == 1) {
            await clearVoteMutation.mutateAsync({
                petition_id: petition_id!!,
            });
            setUserVote(0);
        } else {
            await thumbsUpMutation.mutateAsync({
                petition_id: petition_id!!,
                vote: 'up',
            });
            setUserVote(1);
        }
        refetch();
    };

    const clickThumbsDown = async () => {
        if (userVote == -1) {
            await clearVoteMutation.mutateAsync({
                petition_id: petition_id!!,
            });
            setUserVote(0);
        } else {
            await thumbsDownMutation.mutateAsync({
                petition_id: petition_id!!,
                vote: 'down',
            });
            setUserVote(-1);
        }
        refetch();
    };

    const upvoteCount = petition?.data.petition_upvote_count ?? 0;
    const downvoteCount = petition?.data.petition_downvote_count ?? 0;
    const totalVoteCount = upvoteCount + downvoteCount;

    return (
        <>
            <div className="max-w-screen-sm mx-auto px-4 pt-12 mb-28 flex flex-col gap-4">
                <div className={'space-x-1 text-lg text-stone-500'}>
                    <span>
                        {new Date().toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                        {','}
                    </span>
                    <span className={'italic font-semibold'}>
                        {petition?.extras.user.name ?? ''}
                    </span>
                    <span>—</span>
                    <span>To</span>
                    <span className={'italic font-semibold'}>
                        {petition?.data.target ?? 'UNKNOWN MINISTRY'}.
                    </span>
                </div>
                <h1 className="text-4xl font-bold font-serif">
                    {petition?.data.title ?? 'Untiled Petition'}
                </h1>
                <div className="space-x-2 border-l-4 pl-4 text-neutral-700 text-lg">
                    <span>It affects</span>
                    <span className={'italic font-semibold'}>
                        {petition?.data.location ?? 'SOMEONE, SOMEWHERE'}.
                    </span>
                </div>
                <ImageCarousel />
                {petition?.data.description && (
                    <Markdown>{petition.data.description}</Markdown>
                )}
            </div>
            {isAuthenticated ? (
                <div className="fixed bottom-0 left-0 w-full py-2 bg-background px-4 z-20">
                    <div
                        className={
                            'w-full mx-auto max-w-screen-sm flex flex-row space-x-2'
                        }>
                        <Button
                            variant={
                                userVote === 1 || userVote === 0
                                    ? 'default'
                                    : 'outline'
                            }
                            intent={'success'}
                            size={'lg'}
                            className="flex-1 w-full"
                            onClick={clickThumbsUp}>
                            <ThumbsUp size={20} />{' '}
                            <p className="ml-2">{upvoteCount}</p>
                        </Button>
                        <Button
                            variant={
                                userVote === -1 || userVote === 0
                                    ? 'default'
                                    : 'outline'
                            }
                            intent={'default'}
                            className="flex-1 w-full"
                            size={'lg'}
                            onClick={clickThumbsDown}>
                            <ThumbsDown size={20} />{' '}
                            <p className="ml-2">{downvoteCount}</p>
                        </Button>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default SinglePetition;
