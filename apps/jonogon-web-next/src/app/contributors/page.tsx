'use client';

import { trpc } from '@/trpc/client';

export default function Contributors() {
	const fixedContributors = [
		'Hussain M Elius',
		'Omran Jamal',
		'Naseef Fatemi',
		'Salman Beg',
		'Sashosto Seeam',
		'Shadman Sakib',
		'Farhan Ali',
		'Tasnim Rahman',
		'Syed Hasan',
		'Ratul Karim',
	];

	const { data: dynamicContributors = [], isLoading } =
		trpc.users.getAllUserNames.useQuery();

	const allContributors = [
		...fixedContributors,
		...dynamicContributors.map(
			(contributor) => contributor.name ?? 'Anonymous',
		),
	];

	const isFixedContributor = (name: string) =>
		fixedContributors.includes(name);

	return (
		<div className="max-w-screen-sm mx-auto px-4 flex flex-col justify-center">
			<title>Contributors — জনগণ</title>
			<h1 className="text-3xl py-12 md:py-20 font-regular text-stone-600 leading-0">
				Contributors
			</h1>

			{isLoading ? (
				<p>Loading contributors...</p>
			) : (
				<ul className="list-disc list-inside space-y-2">
					{allContributors.length > 0 ? (
						allContributors.map((contributor, index) => (
							<li
								key={index}
								className="text-lg text-stone-600 flex items-center gap-2"
							>
								{contributor}
								{/* Add star emoji for fixed contributors */}
								{isFixedContributor(contributor) && (
									<span>☆</span>
								)}
							</li>
						))
					) : (
						<p>No contributors found.</p>
					)}
				</ul>
			)}
		</div>
	);
}
