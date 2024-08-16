import * as React from 'react';

import {Card, CardContent} from '@/app/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/app/components/ui/carousel';

const testImages = [
    'https://ecdn.dhakatribune.net/contents/cache/images/640x359x1/uploads/dten/2021/12/19/web-bnp-fakhrul-press-briefing-gulshan-rajib-dhar-31-12-2018-1546260639583-1546260639584.jpeg',
];

export function ImageCarousel() {
    return (
        <div className="flex justify-center items-center w-full w-max-screen-xs">
            <Carousel className="w-full relative">
                <CarouselPrevious className="absolute top-[50%] left-2 z-10 opacity-75" />
                <CarouselContent className="z-0">
                    {Array.from({length: 5}).map((_, index) => (
                        <CarouselItem key={index}>
                            <div>
                                <Card>
                                    <CardContent className="flex items-center justify-center p-0">
                                        {/* <span className="text-4xl font-semibold">
                                            Image {index + 1}
                                        </span> */}
                                        <img
                                            src={testImages[0]}
                                            className="w-full h-auto"
                                        />
                                        {/* <div className="relative">
                                        TODO: make this appear floating on top of the carousel
                                        <div>
                                            <CarouselPrevious className="fixed top-15" />
                                        </div>
                                        <div>
                                            <CarouselNext className="fixed bottom-50" />
                                        </div>
                                    </div> */}
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext className="absolute top-[50%] right-2 opacity-75" />
            </Carousel>
        </div>
    );
}
