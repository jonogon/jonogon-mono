import {useAuthState, useTokenManager} from '../auth/token-manager.tsx';
import {trpc} from '../trpc/index.mjs';
import {useEffect} from 'react';
import '@/styles/globals.css';
import Navigation from '@/components/custom/Navigation.tsx';
import PetitionList from '@/components/custom/PetitionList.js';

export default function Index() {
    return (
        <div className="flex flex-col gap-6 ">
            <Navigation />
			<PetitionList />
        </div>
    );
}
