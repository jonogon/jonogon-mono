'use client';

import {useState, useEffect, useCallback} from 'react';
import {trpc} from '@/trpc/client';
import {useAuthState} from '@/auth/token-manager';
import {toast} from '@/components/ui/use-toast';
import OTPStage from '@/components/custom/OTPStage';
import NumberStage from '@/components/custom/NumberStage';
import {useRouter, useSearchParams} from 'next/navigation';
import {firebaseAuth} from '@/firebase';
import {signInWithCustomToken} from 'firebase/auth';
import {z} from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {useLoginModal} from '@/contexts/LoginModalContext';

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
    } catch (e) {
        return null;
    }
}

export default function LoginModal() {
    const [number, setNumber] = useState(
        process.env.NODE_ENV === 'development' ? '01111111111' : '',
    );

    const [otp, setOTP] = useState(
        process.env.NODE_ENV === 'development' ? '1111' : '',
    );

    const [stage, setStage] = useState<'number' | 'otp'>('number');
    const [
        isLoginAndSideEffectsIncomplete,
        setIsLoginAndSideEffectsIncomplete,
    ] = useState(false);

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
        [],
    );

    const updateOTP = useCallback((newValue: string) => {
        setOTP(newValue.replace(/[^[0-9]/g, '').substring(0, 4));
    }, []);

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

    const {isOpen, closeModal, redirectUrl} = useLoginModal();

    const isAuthenticated = useAuthState();

    const router = useRouter();
    const params = useSearchParams();

    const effectiveRedirectUrl = redirectUrl ?? params.get('next') ?? '/';

    const {mutate: createPetition, isLoading: isPetitionCreateOngoing} =
        trpc.petitions.create.useMutation({
            onSuccess(response) {
                router.push(`/petitions/${response.data.id}?status=submitted`);
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
                        closeModal();
                        setIsLoginAndSideEffectsIncomplete(false);

                        if (effectiveRedirectUrl === '/petition/draft') {
                            const localDraft = getLocalDraft();
                            createPetition(
                                localDraft
                                    ? {loggedOutDraft: localDraft}
                                    : undefined,
                            );
                            window.localStorage.removeItem('draft-petition');
                            return;
                        }

                        window.localStorage.removeItem('draft-petition');
                        router.push(effectiveRedirectUrl);
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
                title: 'OTP Request Error',
                description: otpRequestError.message,
            });
        }
    }, [otpRequestError]);

    useEffect(() => {
        if (isAuthenticated && !isLoginAndSideEffectsIncomplete) {
            closeModal();
        }
    }, [isAuthenticated, isLoginAndSideEffectsIncomplete, closeModal]);
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal();
                }
            }}
        >
            <DialogContent className="max-w-screen-sm mx-auto px-4 flex flex-col justify-center">
                <DialogHeader>
                    <DialogTitle>জনগণের প্লাটফর্মে Login করুন 🇧🇩</DialogTitle>
                </DialogHeader>
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
                        isLoading={
                            isTokenLoading ||
                            isPetitionCreateOngoing ||
                            isLoginAndSideEffectsIncomplete
                        }
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
