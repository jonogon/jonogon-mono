import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/app/components/ui/pagination';
import PetitionCard from './PetitionCard';

const PetitionList = () => {
    return (
        <div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px',
                }}>
                {Array.from({length: 10}).map((_, index) => (
                    <PetitionCard key={index + 'key-for-now'} />
                ))}
            </div>
            <div className={'py-4'}>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default PetitionList;
