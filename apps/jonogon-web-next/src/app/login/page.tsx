'use client';

import {useCallback, useEffect, useState} from 'react';
import {trpc} from '@/trpc/client';
import {useAuthState} from '@/auth/token-manager';
import {toast} from '@/components/ui/use-toast';
import OTPStage from '@/components/custom/OTPStage';
import NumberStage from '@/components/custom/NumberStage';
import {useRouter, useSearchParams} from 'next/navigation';
import {firebaseAuth} from '@/firebase';
import {signInWithCustomToken} from 'firebase/auth';
import { z } from 'zod';

function getLocalDraft() {
    const draft = localStorage.getItem('draft-petition');

    if (!draft) return null;

    try {
        const parsed = z
            .object({
                title: z.string(),
                target: z.string(),
                location: z.string(),
                description: z.string(),
            })
            .partial()
            .safeParse(JSON.parse(draft));

        return parsed.success ? parsed.data : null;
    }
    catch (e) {
        return null;
    }
}

export default function Login() {
    const [number, setNumber] = useState(
        process.env.NODE_ENV === 'development' ? '01111111111' : '',
    );

    const [otp, setOTP] = useState(
        process.env.NODE_ENV === 'development' ? '1111' : '',
    );

    const [stage, setStage] = useState<'number' | 'otp'>('number');
    const [isLoginAndSideEffectsIncomplete, setIsLoginAndSideEffectsIncomplete] = useState(false);

    const {
        mutate: requestOTP,
        isLoading: isRequestLoading,
        error: otpRequestError,
    } = trpc.auth.requestOTP.useMutation();

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

    const isAuthenticated = useAuthState();

    const router = useRouter();
    const params = useSearchParams();

    const redirectUrl: string = params.get('next') ?? '/';

    const {mutate: createPetition, isLoading: isPetitionCreateOngoing} = trpc.petitions.create.useMutation({
        onSuccess(response) {
            router.push(`/petitions/${response.data.id}/edit?fresh=true`);
        },
    });

    const login = () => {
        setIsLoginAndSideEffectsIncomplete(true);
        createToken(
            {
                phoneNumber: `+88${number}`,
                otp: otp,
            },
            {
                onSuccess: async (data) => {
                    const credentials = await signInWithCustomToken(
                        firebaseAuth(),
                        data.firebase_custom_token,
                    );

                    if (credentials.user) {
                        // TODO: fix properly with logged out draft petition
                        if (redirectUrl === '/petition/draft') {
                            const localDraft = getLocalDraft();
                            createPetition(
                                localDraft 
                                    ? { loggedOutDraft: localDraft } 
                                    : undefined
                            );
                            window.localStorage.removeItem('draft-petition');
                            return;
                        }

                        setIsLoginAndSideEffectsIncomplete(false);
                        router.push(redirectUrl);
                    }
                },
            },
        );
    };

    const onChangeNumPress = () => {
        setStage('number');
    };

    useEffect(() => {
        if (otpRequestError) {
            toast({
                title: 'Otp Request Error',
                description: otpRequestError.message,
            });
        }
    }, [otpRequestError]);

    useEffect(() => {
        if (isAuthenticated && !isLoginAndSideEffectsIncomplete) router.replace("/");
    }, [isAuthenticated, isLoginAndSideEffectsIncomplete]);

    return (
        <div className="max-w-screen-sm mx-auto px-4 flex flex-col justify-center">
            <title>Login — জনগণ</title>
            <h1
                className={
                    'text-3xl py-12 md:py-20 font-regular text-stone-600 leading-0'
                }>
                জনগণের প্লাটফর্মে Login করুন 🇧🇩
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
                    number={number}
                    otp={otp}
                    onOTPChange={updateOTP}
                    onVerify={login}
                    onChangeNumPress={onChangeNumPress}
                    onOtpResendPress={sendOTPRequest}
                    isLoading={isTokenLoading || isPetitionCreateOngoing}
                />
            )}
        </div>
    );
}
