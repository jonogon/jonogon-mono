import NumberStage from '@/app/components/custom/NumberStage.tsx';
import OTPStage from '@/app/components/custom/OTPStage.tsx';
import {useCallback, useState} from 'react';
import {useLocation} from 'wouter';
import {useTokenManager} from '../auth/token-manager.tsx';
import {trpc} from '../trpc/index.jsx';

export default function Index() {
    const [number, setNumber] = useState(
        import.meta.env.DEV ? '01111111111' : '',
    );

    const [otp, setOTP] = useState(import.meta.env.DEV ? '1111' : '');

    const [stage, setStage] = useState<'number' | 'otp'>('number');

    const {mutate: requestOTP, isLoading: isRequestLoading} =
        trpc.auth.requestOTP.useMutation();

    const {mutate: createToken, isLoading: isTokenLoading} =
        trpc.auth.createToken.useMutation();

    const updateNumber = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setNumber(ev.target.value.replace(/[^[0-9]/g, '').substring(0, 11));
        },
        [setNumber],
    );

    const updateOTP = useCallback(
        (newValue: string) => {
            setOTP(newValue.replace(/[^[0-9]/g, '').substring(0, 4));
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
                        refreshTokenValidity:
                            data.refresh_token_validity * 1000,
                    });

                    setLocation('/');
                },
            },
        );
    };

    return (
        <div className="max-w-screen-sm mx-auto px-4 flex flex-col justify-center">
            <h1
                className={
                    'text-5xl py-12 md:py-20 font-bold text-stone-600 leading-0'
                }>
                Login To The জনগণের Platform 🇧🇩
            </h1>
            {stage === 'number' ? (
                <NumberStage
                    number={number}
                    onNumberChange={updateNumber}
                    onNext={sendOTPRequest}
                    isLoading={isRequestLoading}
                />
            ) : (
                <OTPStage
                    otp={otp}
                    onOTPChange={updateOTP}
                    onVerify={login}
                    isLoading={isTokenLoading}
                />
            )}
        </div>
    );
}
