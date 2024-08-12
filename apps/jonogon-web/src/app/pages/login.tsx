import { type ChangeEvent, useCallback, useState } from 'react';
import { trpc } from '../trpc/index.mjs';
import { useLocation } from 'wouter';
import { useTokenManager } from '../auth/token-manager.tsx';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp.tsx';

export default function Index() {
	const [number, setNumber] = useState(
		// no worries, the vite compiler will remove this in production
		import.meta.env.DEV ? '01111111111' : '',
	);

	const [otp, setOTP] = useState(import.meta.env.DEV ? '1111' : '');

	const [stage, setStage] = useState<'number' | 'otp'>('otp');

	const { mutate: requestOTP, isLoading: isRequestLoading } =
		trpc.auth.requestOTP.useMutation();

	const { mutate: createToken, isLoading: isTokenLoading } =
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

	const { set: setTokens } = useTokenManager();
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
		<div className="flex flex-col items-center h-screen justify-center">
			{stage === 'number' ? (
				<Card className="flex flex-col gap-4">
					<CardHeader className="flex items-center">
						<img
							src="/images/logo.png"
							alt="logo"
							className="w-24 h-24"
						/>
						<CardTitle>Sign in to post and comment</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Input placeholder="Enter your phone number" />
						<Button>Next</Button>
					</CardContent>
				</Card>
			) : (
				<Card className="flex flex-col gap-4">
					<CardHeader className="flex items-center">
						<img
							src="/images/logo.png"
							alt="logo"
							className="w-24 h-24"
						/>
						<CardTitle>Please enter OTP</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4 items-center w-full">
						<InputOTP maxLength={4}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
							</InputOTPGroup>
						</InputOTP>
						<Button className="w-full">Verify</Button>
						<span>Resend OTP</span>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
