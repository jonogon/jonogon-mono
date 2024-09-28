import {Card, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';

export default function PetitionCardSkeleton({
    mode,
}: {
    mode: 'formalized' | 'request' | 'own';
}) {
    return (
        <Card>
            <CardHeader className={'p-4'}>
                <CardTitle className={'flex flex-row items-stretch space-x-4'}>
                    <div className={'flex-1'}>
                        <div className="bg-border rounded animate-pulse h-8 w-full mb-2"></div>
                        <div className="bg-border rounded animate-pulse h-5 w-60"></div>
                    </div>
                    <div className="bg-border rounded animate-pulse h-16 w-16"></div>
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center justify-between p-2 px-4 border-t border-t-background">
                {mode === 'formalized' ? (
                    <>
                        <div className={'flex flex-row gap-4 px-1'}>
                            <div className="bg-border rounded animate-pulse h-7 md:w-36 w-20"></div>
                            <div className="bg-border rounded animate-pulse h-7 md:w-48 w-24"></div>
                        </div>
                        <div className="bg-border rounded animate-pulse h-7 md:w-20 w-12"></div>
                    </>
                ) : mode === 'request' ? (
                    <>
                        <div className={'flex flex-row gap-4 px-1'}>
                            <div className="bg-border rounded animate-pulse h-7 md:w-12 w-10"></div>
                            <div className="bg-border rounded animate-pulse h-7 md:w-12 w-10"></div>
                            <div className="bg-border rounded animate-pulse h-7 md:w-32 w-12"></div>
                        </div>
                        <div className="bg-border rounded animate-pulse h-7 md:w-20 w-12"></div>
                    </>
                ) : mode === 'own' ? (
                    <>
                        <div className={'flex flex-row gap-4 px-1'}>
                            <div className="bg-border rounded animate-pulse h-7 md:w-12 w-10"></div>
                            <div className="bg-border rounded animate-pulse h-7 md:w-12 w-10"></div>
                            <div className="bg-border rounded animate-pulse h-7 md:w-32 w-12"></div>
                        </div>
                        <div className="bg-border rounded animate-pulse h-7 md:w-20 w-12"></div>
                    </>
                ) : null}
            </CardFooter>
        </Card>
    );
}
