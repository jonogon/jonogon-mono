import {trpc} from '@/trpc/client';

import {Card, CardContent} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

import {CiNoWaitingSign} from 'react-icons/ci';
import {useParams} from 'next/navigation';

export function ImageCarousel() {
    const {id: petition_id} = useParams<{id: string}>();

    const {data: petition} = trpc.petitions.get.useQuery({
        id: petition_id!!,
    });

    if (petition?.data.attachments.length) {
        return (
            <div className="flex justify-center items-center w-full w-max-screen-xs">
                <Carousel className="w-full relative rounded-lg overflow-clip">
                    <CarouselPrevious
                        variant={'outline'}
                        className="absolute top-[50%] left-2 z-10"
                    />
                    <CarouselContent className="z-0">
                        {Array.from({
                            length: petition?.data.attachments.length ?? 0,
                        }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className={
                                    'bg-border flex justify-center items-center'
                                }>
                                <Card>
                                    <CardContent className="flex items-center justify-center p-0">
                                        <img
                                            src={`${
                                                petition?.data.attachments[
                                                    index
                                                ].attachment
                                            }`.replace(
                                                '$CORE_HOSTNAME',
                                                window.location.hostname,
                                            )}
                                            className="w-full h-full bg-red-500"
                                        />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNext
                        variant={'outline'}
                        className="absolute top-[50%] right-2 z-10"
                    />
                </Carousel>
            </div>
        );
    } else {
        return (
            <div className="flex flex-row gap-1 items-center">
                <CiNoWaitingSign />
                <p>No Attachments Added</p>
            </div>
        );
    }
}
