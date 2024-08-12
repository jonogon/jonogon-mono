import Navigation from '@/app/components/custom/Navigation.tsx';
import PetitionList from '@/app/components/custom/PetitionList.js';

const Home = () => {
    return (
        <div className="flex flex-col gap-6 ">
            <Navigation />
            <PetitionList />
        </div>
    );
};

export default Home;
