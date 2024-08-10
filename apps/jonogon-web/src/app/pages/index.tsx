import {useAuthState, useTokenManager} from '../auth/token-manager.tsx';
import {trpc} from '../trpc/index.mjs';
import {useEffect} from 'react';

export default function Index() {
    const {get} = useTokenManager();
    const authState = useAuthState();

    const {data} = trpc.users.getSelf.useQuery(undefined, {});

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <div>
            <div>Homepage authState</div>
            <div>
                <button onClick={() => get({forceRefresh: true})}>
                    refresh token
                </button>
            </div>
        </div>
    );
}
