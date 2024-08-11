import { useAuthState, useTokenManager } from '../auth/token-manager.tsx';
import { trpc } from '../trpc/index.mjs';
import { useEffect } from 'react';
import '@/styles/globals.css';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';

export default function Index() {
	const { get } = useTokenManager();
	const authState = useAuthState();

	const { data } = trpc.users.getSelf.useQuery(undefined, {});

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<div>
			<div>Homepage authState</div>
			<div>
				<button onClick={() => get({ forceRefresh: true })}>
					refresh token
				</button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>
		</div>
	);
}
