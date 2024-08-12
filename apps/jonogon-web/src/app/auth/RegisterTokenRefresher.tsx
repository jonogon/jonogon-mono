import {trpc} from '../trpc/index.jsx';
import {useTokenManager} from './token-manager.tsx';
import {useEffect} from 'react';

export function RegisterTokenRefresher() {
    const {setRefreshFunc} = useTokenManager();
    const {mutateAsync} = trpc.auth.refreshToken.useMutation();

    useEffect(() => {
        setRefreshFunc(async (options) => {
            const result = await mutateAsync({
                refreshToken: options.refreshToken,
            });

            return {
                accessToken: result.access_token,
                accessTokenValidity: result.access_token_validity * 1000,

                refreshToken: result.refresh_token,
                refreshTokenValidity: result.refresh_token_validity * 1000,
            };
        });
    }, []);

    return null;
}
