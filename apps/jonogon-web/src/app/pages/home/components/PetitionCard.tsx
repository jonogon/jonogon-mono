import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';
import {Link} from 'wouter';
import {Button} from '@/app/components/ui/button.tsx';

export default function PetitionCard() {
    return (
        <Card className={''}>
            <CardHeader className={''}>
                <CardTitle>
                    <div
                        className={
                            'font-normal text-base text-neutral-500 pb-2'
                        }>
                        Naseef Fatemi, 5th August, 2024 — To,{' '}
                        <i>গণপূর্ত মন্ত্রণালয়, বাংলাদেশ সরকার</i>
                    </div>
                    <div>
                        <Link
                            href={'/petitions/1'}
                            className={
                                'leading-snug font-bold font-serif text-3xl align-middle'
                            }>
                            Dismantle The Rapid Action Battalion & Stop Extra
                            Judicial Killings of Innocent Bangladeshi Civilians
                        </Link>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
                <p className={'font-semibold text-red-600'}>1,203,444 votes</p>
                <Button size={'sm'} variant={'outline'}>
                    VOTE
                </Button>
            </CardFooter>
        </Card>
    );
}
