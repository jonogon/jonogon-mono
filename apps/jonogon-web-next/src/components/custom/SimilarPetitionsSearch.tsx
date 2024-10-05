import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { debounce } from 'lodash';

interface SimilarPetition {
    id: string;
    title: string;
}

interface SimilarPetitionsSearchProps {
    title: string;
    onClose: () => void;
}

export default function SimilarPetitionsSearch({ title, onClose }: SimilarPetitionsSearchProps) {
    const [similarPetitions, setSimilarPetitions] = useState<SimilarPetition[]>([]);

    const { data: searchResults, refetch } = trpc.petitions.searchSimilar.useQuery(
        { title },
        { enabled: false }
    );

const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
    if (searchTerm.length >= 5) {
        refetch();
    } else {
        setSimilarPetitions([]);
    }
    }, 300),
    [refetch, setSimilarPetitions]
);

useEffect(() => {
    debouncedSearch(title);
}, [title, debouncedSearch]);

useEffect(() => {
    if (searchResults) {
    setSimilarPetitions(searchResults.data);
    }
}, [searchResults]);

if (similarPetitions.length === 0) {
    return null;
}

const displayedPetitions = similarPetitions.slice(0, 5);
const hasMorePetitions = similarPetitions.length > 5;

return (
    <Card className="mt-4 bg-background border-red-500">
    <CardHeader className="flex items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <CardTitle className="text-xl font-bold text-red-500">Similar Petitions Found</CardTitle>
    </CardHeader>
    <CardContent>
        <p className="mb-4 text-sm text-stone-600 font-medium">
        We found some petitions that might be similar to yours. Please check if your petition already exists:
        </p>
        <ul className="space-y-2 divide-y divide-gray-200">
        {displayedPetitions.map((petition) => (
            <li key={petition.id} className="py-2">
            <Link href={`/petitions/${petition.id}`} className="text-neutral-900 flex items-center">
                <span className="mr-2">•</span>
                {petition.title}
            </Link>
            </li>
        ))}
        </ul>
        {hasMorePetitions && (
        <p className="mt-2 text-sm text-stone-500 italic">
            And {similarPetitions.length - 5} more similar petitions...
        </p>
        )}
        <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full justify-between"
        onClick={onClose}
        >
        Continue with my petition
        <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
    </CardContent>
    </Card>
);
}
