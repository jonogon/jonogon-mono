import {type ChangeEvent, useCallback, useState} from 'react';
import {trpc} from '../trpc/index.mjs';
import {Button} from '../components/Button.tsx';
import {useLocation} from 'wouter';
import {useTokenManager} from '../auth/token-manager.tsx';

export default function Index() {
    const [number, setNumber] = useState(
        // no worries, the vite compiler will remove this in production
        import.meta.env.DEV ? '01111111111' : '',
    );

    const [otp, setOTP] = useState(import.meta.env.DEV ? '1111' : '');

    const [stage, setStage] = useState<'number' | 'otp'>('number');

    const {mutate: requestOTP, isLoading: isRequestLoading} =
        trpc.auth.requestOTP.useMutation();

    const {mutate: createToken, isLoading: isTokenLoading} =
        trpc.auth.createToken.useMutation();

    const updateNumber = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            setNumber(ev.target.value.replace(/[^[0-9]/g, '').substring(0, 11));
        },
        [setNumber],
    );

    const updateOTP = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            setOTP(ev.target.value.replace(/[^[0-9]/g, '').substring(0, 4));
        },
        [setOTP],
    );

    const sendOTPRequest = () => {
        requestOTP(
            {
                phoneNumber: `+88${number}`,
            },
            {
                onSuccess: () => {
                    setStage('otp');
                },
            },
        );
    };

    const {set: setTokens} = useTokenManager();
    const [, setLocation] = useLocation();

    const login = () => {
        createToken(
            {
                phoneNumber: `+88${number}`,
                otp: otp,
            },
            {
                onSuccess: async (data) => {
                    await setTokens({
                        accessToken: data.access_token,
                        accessTokenValidity: data.access_token_validity * 1000,
                        refreshToken: data.refresh_token,
                        refreshTokenValidity: data.access_token_validity * 1000,
                    });

                    setLocation('/');
                },
            },
        );
    };

    const isNumberValid = /^01[0-9]{9}$/g.test(number);
    const isOTPValid = /^[0-9]{4}$/g.test(otp);

    return (
        <div>
            {stage === 'number' ? (
                <div className={'flex flex-col'}>
                    <label htmlFor={'phone-number'}>Phone Number</label>
                    <input
                        key={'phone-number'}
                        id={'phone-number'}
                        className={'border-2'}
                        onChange={updateNumber}
                        value={number}
                        placeholder={'01xxxxxxxxx'}
                        autoFocus
                    />
                    <Button onClick={sendOTPRequest} disabled={!isNumberValid}>
                        Login
                    </Button>
                </div>
            ) : (
                <div className={'flex flex-col'}>
                    <label htmlFor={'otp'}>Enter OTP</label>
                    <input
                        key={'otp'}
                        id={'otp'}
                        className={'border-2'}
                        onChange={updateOTP}
                        value={otp}
                        placeholder={'XXXX'}
                        autoFocus
                    />
                    <Button onClick={login} disabled={!isOTPValid}>
                        Login
                    </Button>
                </div>
            )}
        </div>
    );
}
