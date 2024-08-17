import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';
import {Link, useLocation} from 'wouter';
import {Button} from '@/app/components/ui/button.tsx';
import {formatDate} from '../../../lib/date.mjs';
import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {useAuthState} from '@/app/auth/token-manager.tsx';

export default function PetitionCard(props: {
    id: string;

    name: string;
    date: Date;
    target: string;
    title: string;

    status: string;

    upvotes: number;
    downvotes: number;

    mode: 'request' | 'formalized' | 'own';
}) {
    const isAuthenticated = useAuthState();

    const [, setLocation] = useLocation();
    const totalVotes = props.upvotes + props.downvotes;

    return (
        <Card className={''}>
            <CardHeader className={''}>
                <CardTitle>
                    <div
                        className={
                            'font-normal text-base text-neutral-500 pb-2'
                        }>
                        {props.name}, {formatDate(props.date)} — To,{' '}
                        <i>{props.target}</i>
                    </div>
                    <div>
                        <Link
                            href={`/petitions/${props.id}`}
                            className={
                                'leading-snug font-bold font-serif text-2xl align-middle'
                            }>
                            {props.title}
                        </Link>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
                {props.mode === 'formalized' ? (
                    <>
                        <p className={'font-semibold text-red-600'}>
                            {totalVotes} {totalVotes !== 1 ? 'votes' : 'vote'}
                        </p>
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            onClick={() => {
                                const href = `/petitions/${props.id}`;

                                isAuthenticated
                                    ? setLocation(href)
                                    : setLocation(
                                          `/login?next=${encodeURIComponent(href)}`,
                                      );
                            }}>
                            VOTE
                        </Button>
                    </>
                ) : props.mode === 'request' ? (
                    <>
                        <div className={'flex flex-row gap-6'}>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsUp
                                    className={'w-5 h-5 text-green-500'}
                                />
                                {props.upvotes}
                            </div>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsUp className={'w-5 h-5 text-red-500'} />
                                {props.downvotes}
                            </div>
                        </div>
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            onClick={() => {
                                const href = `/petitions/${props.id}`;

                                isAuthenticated
                                    ? setLocation(href)
                                    : setLocation(
                                          `/login?next=${encodeURIComponent(href)}`,
                                      );
                            }}>
                            VOTE
                        </Button>
                    </>
                ) : props.mode === 'own' ? (
                    <>
                        <div className={'flex flex-row gap-6'}>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsUp
                                    className={'w-5 h-5 text-green-500'}
                                />
                                {props.upvotes}
                            </div>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsUp className={'w-5 h-5 text-red-500'} />
                                {props.downvotes}
                            </div>
                        </div>
                        <div>STATUS: {props.status}</div>
                    </>
                ) : null}
            </CardFooter>
        </Card>
    );
}
