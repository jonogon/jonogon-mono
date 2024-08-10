import {useAuthState} from '../auth/token-manager.tsx';
import {trpc} from '../trpc/index.mjs';
import {useEffect} from 'react';

export default function Index() {
    const authState = useAuthState();

    const {data} = trpc.users.getSelf.useQuery(undefined, {
        refetchInterval: 2000,
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

    return `Homepage ${authState}`;
}
