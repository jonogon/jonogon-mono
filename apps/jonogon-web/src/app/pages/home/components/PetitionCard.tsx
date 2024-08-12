import {ThumbsDown, ThumbsUp} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/app/components/ui/card';

export default function PetitionCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="truncate">Petition Title</CardTitle>

                <CardDescription>
                    <span>by John Doe</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="line-clamp-3">
                <p>
                    Petition Description Petition Description Petition
                    Description Petition Description Petition Description
                    Petition Description Petition Description Petition
                    Description
                </p>
            </CardContent>
            <CardFooter className="flex items-center px-6 py-6 justify-between">
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
    );
}
