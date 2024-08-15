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

export default function PetitionCard() {
    return (
        <Link href={'/petitions/1'}>
            <Card>
                <CardHeader>
                    <CardTitle className={'leading-snug'}>
                        Dismantle The Rapid Action Battalion & Stop Extra
                        Judicial Killings of Innocent Bangladeshi Civilians
                    </CardTitle>

                    <CardDescription>
                        by{' '}
                        <Link href={'/petitions/1'} className={'font-bold'}>
                            Vaper Raju
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent className="line-clamp-3"></CardContent>
                <CardFooter className="flex items-center justify-between">
                    <p className="font-medium">Petition Category</p>
                    <div className="flex gap-4">
                        <div className="flex gap-2 items-center">
                            <ThumbsUp size={16} />
                            <span className="ml-1">100</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <ThumbsDown size={16} />
                            <span className="ml-1">20</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
