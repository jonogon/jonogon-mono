import {Card, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {useAuthState} from '@/auth/token-manager';
import {formatDate} from '@/lib/date';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

export default function PetitionCard(props: {
    id: string;

    name: string;
    date: Date;
    target: string;
    title: string;
    attachment: string;

    status: string;

    upvotes: number;
    downvotes: number;

    mode: 'request' | 'formalized' | 'own';
}) {
    const isAuthenticated = useAuthState();

    const router = useRouter();
    const totalVotes = props.upvotes + props.downvotes;

    return (
        <Card
            className={'cursor-pointer'}
            onClick={() => {
                router.push(`/petitions/${props.id}`);
            }}>
            <CardHeader className={'p-4'}>
                <CardTitle className={'flex flex-row items-stretch space-x-4'}>
                    {props.attachment && (
                        <div className={''}>
                            <img
                                src={`${props.attachment}`.replace(
                                    '$CORE_HOSTNAME',
                                    window.location.hostname,
                                )}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover object-center rounded bg-background"
                            />
                        </div>
                    )}

                    <div className={'flex-1'}>
                        <div
                            className={
                                'font-normal text-base text-neutral-500 pb-1'
                            }>
                            <div>
                                <i>{props.name}</i> —{' '}
                                <time
                                    dateTime={props.date.toISOString()}
                                    suppressHydrationWarning>
                                    {formatDate(props.date)}
                                </time>
                            </div>
                        </div>

                        <div
                            className={
                                'leading-[1.1] font-bold font-serif text-xl md:text-2xl align-middle break-words overflow-hidden text-ellipsis'
                            }>
                            {props.title}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center justify-between p-2 border-t border-t-background">
                {props.mode === 'formalized' ? (
                    <>
                        <p className={'font-semibold text-red-600 px-4'}>
                            {totalVotes} {totalVotes !== 1 ? 'votes' : 'vote'}
                        </p>
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            onClick={(ev) => {
                                ev.stopPropagation();

                                const href = `/petitions/${props.id}`;

                                isAuthenticated
                                    ? router.push(href)
                                    : router.push(
                                          `/login?next=${encodeURIComponent(href)}`,
                                      );
                            }}>
                            VOTE
                        </Button>
                    </>
                ) : props.mode === 'request' ? (
                    <>
                        <div className={'flex flex-row gap-6 mx-2'}>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsUp
                                    className={'w-5 h-5 text-green-500'}
                                />
                                {props.upvotes}
                            </div>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsDown
                                    className={'w-5 h-5 text-red-500'}
                                />
                                {props.downvotes}
                            </div>
                        </div>
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            onClick={() => {
                                const href = `/petitions/${props.id}`;

                                isAuthenticated
                                    ? router.push(href)
                                    : router.push(
                                          `/login?next=${encodeURIComponent(href)}`,
                                      );
                            }}>
                            VOTE
                        </Button>
                    </>
                ) : props.mode === 'own' ? (
                    <>
                        <div className={'flex flex-row gap-6 mx-2'}>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsUp
                                    className={'w-5 h-5 text-green-500'}
                                />
                                {props.upvotes}
                            </div>
                            <div className={'flex flex-row gap-2'}>
                                <ThumbsDown
                                    className={'w-5 h-5 text-red-500'}
                                />
                                {props.downvotes}
                            </div>
                        </div>
                        <div className={'font-mono text-sm'}>
                            STATUS: {props.status}
                        </div>
                    </>
                ) : null}
            </CardFooter>
        </Card>
    );
}
