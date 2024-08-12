// Create a petition list component that renders a list of PetitionCard components.

import PetitionCard from './PetitionCard';
import PetitionFilter from './PetitionFilter';

export default function PetitionList() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <h3 className="font-medium text-2xl">Trending Petitions</h3>
                <PetitionFilter />
            </div>
            <div className="flex flex-wrap gap-4">
                <PetitionCard />
                <PetitionCard />
                <PetitionCard />
                <PetitionCard />
                <PetitionCard />
                <PetitionCard />
                <PetitionCard />
                <PetitionCard />
            </div>
        </div>
    );
}
