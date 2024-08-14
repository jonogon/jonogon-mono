import * as React from 'react';

import {Card, CardContent} from '@/app/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/app/components/ui/carousel';

export function ImageCarousel() {
    return (
        <div className="flex justify-center items-center w-full my-4">
            <Carousel className="w-full ">
                <CarouselContent>
                    {Array.from({length: 5}).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">
                                            Image {index + 1}
                                        </span>
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
            </Carousel>
        </div>
    );
}
