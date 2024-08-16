import {trpc} from '@/app/trpc';
import {useParams} from 'wouter';
import {TbTargetArrow} from 'react-icons/tb';
import {SiRelay} from 'react-icons/si';

import {ThumbsDown, ThumbsUp} from 'lucide-react';

import {Progress} from '@/app/components/ui/progress';
import {ImageCarousel} from './components/ImageCarousel';
import {Button} from '@/app/components/ui/button';
import {Card} from '@/app/components/ui/card';
import {useEffect, useState} from 'react';

const SinglePetition = () => {
    const {petition_id} = useParams();
    const {data: petition, refetch} = trpc.petitions.get.useQuery({
        id: petition_id!!,
    });

    const [userVote, setUserVote] = useState(0);

    useEffect(() => {
        setUserVote(petition?.extras.user_vote);
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

    return (
        <div className="container max-w-screen-sm mx-auto px-4 mt-28 flex flex-col gap-4">
            <h2 className="text-4xl font-bold">{petition?.data.title}</h2>
            <div className="flex items-center gap-3 font-medium text-neutral-700">
                <div className="flex items-center gap-2 border-r border-neutral-700 pr-3">
                    <TbTargetArrow />
                    <span>{petition?.data.target}</span>
                </div>
                <div className="flex items-center gap-2">
                    <SiRelay />
                    <span>{petition?.data.location}</span>
                </div>
            </div>
            {petition?.data.description && (
                <p
                    dangerouslySetInnerHTML={{
                        __html: petition?.data.description,
                    }}></p>
            )}
            <div className="flex items-center gap-3 font-medium text-neutral-700">
                <div className="flex items-center gap-2 border-r border-neutral-700 pr-3">
                    <span>
                        {petition?.data.petition_upvote_count ?? 0} upvotes
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        {petition?.data.petition_downvote_count ?? 0} downvotes
                    </span>
                </div>
            </div>
            <Progress
                value={
                    ((petition?.data.petition_upvote_count ?? 0) /
                        ((petition?.data.petition_upvote_count ?? 0) +
                            (petition?.data.petition_downvote_count ?? 0))) *
                        100 ?? 0
                }
            />
            <ImageCarousel />
            <div className="flex flex-row justify-between gap-4 mb-4">
                <Button
                    variant={userVote == 1 ? 'default' : 'outline'}
                    className="flex-grow"
                    onClick={clickThumbsUp}>
                    <ThumbsUp size={20} /> <p className="ml-2">Upvote</p>
                </Button>
                <Button
                    variant={userVote == -1 ? 'default' : 'outline'}
                    className="flex-grow"
                    onClick={clickThumbsDown}>
                    <ThumbsDown size={20} /> <p className="ml-2">Downvote</p>
                </Button>
            </div>
        </div>
    );
};

export default SinglePetition;
