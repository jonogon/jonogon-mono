import Navigation from '@/app/components/custom/Navigation.tsx';
import PetitionList from '@/app/components/custom/PetitionList.js';
import {useState} from 'react';

const Home = () => {
    const [search, setSearch] = useState('');
    return (
        <div className="flex flex-col gap-6 ">
            <Navigation {...{search, setSearch}} />
            <PetitionList />
        </div>
    );
};

export default Home;
