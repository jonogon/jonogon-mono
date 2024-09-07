import { ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { trpc } from '@/trpc/client';

export default function About() {
	// Fixed array of contributors
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

	// Fetch the list of contributors from tRPC
	const { data: dynamicContributors = [], isLoading } =
		trpc.users.getAllUserNames.useQuery();

	// Combine fixed contributors and dynamic contributors, limiting the total to 20
	const combinedContributors = [
		...fixedContributors,
		...dynamicContributors.map(
			(contributor) => contributor.name ?? 'Anonymous',
		),
	].slice(0, 20); // Limit the list to 20 names

	return (
		<div className="flex flex-col">
			<div className="flex flex-col md:flex-row justify-between mb-4">
				<div className="w-full md:w-1/2 pr-4">
					<div className="flex flex-row gap-8">
						<div className="flex flex-col items-center justify-center gap-2">
							<Image
								src="/images/submit.svg"
								alt="submit"
								width={32}
								height={32}
								className="w-8 h-8"
							/>
							<span className="text-white font-light">
								Submit
							</span>
						</div>

						<div className="flex flex-col items-center justify-center gap-2">
							<ThumbsUp size={32} className="text-white" />
							<span className="text-white font-light">Vote</span>
						</div>

						<div className="flex flex-col items-center justify-center gap-2">
							<Image
								src="/images/icon-flower-reversed.svg"
								alt="reform"
								width={32}
								height={32}
								className="w-8 h-8"
							/>
							<span className="text-white font-light">
								Reform
							</span>
						</div>
					</div>

					<div className="mt-6 text-white space-y-4 font-light">
						<p className="font-medium">
							Jonogon is built for the people, by the people.
						</p>
						<p>
							We consist of{' '}
							<span className="font-medium">
								2500+ citizens (and growing)
							</span>{' '}
							who believe in a secular and effective Bangladesh,
							which stands for truth against violence, hatred,
							crime, and discrimination.
						</p>
						<p>
							A Bangladesh where everyone is free to speak without
							fear.
						</p>
						<p>
							A Bangladesh where reform takes place in days, not
							decades.
						</p>
						<p>
							A Bangladesh that works together to open doors of
							opportunity for every citizen.
						</p>
						<p>
							Contribute to this new Bangladesh by submitting your
							দাবি today <br />{' '}
							<span className="font-medium">
								— we’ll ensure your voice matters and leads to
								action.
							</span>
						</p>
					</div>
				</div>

				<div className="flex flex-col w-full md:w-1/2 md:border-l border-white border-opacity-40 md:pl-8 gap-4">
					<p className="text-white font-medium text-xl">
						Our Builders:
					</p>
					<ul className="list-disc list-inside columns-2 space-y-1 text-white font-light">
						{/* Render the contributors' list */}
						{isLoading ? (
							<li>Loading...</li>
						) : combinedContributors.length > 0 ? (
							combinedContributors.map((contributor, index) => (
								<li key={index}>{contributor}</li>
							))
						) : (
							<li>No contributors found</li>
						)}
					</ul>

					{/* Show More button */}
					{combinedContributors.length === 20 && (
						<Button className="w-full bg-white text-black font-medium py-2 rounded-md mt-4">
							Show More
						</Button>
					)}
				</div>
			</div>

			<div className="flex flex-row gap-4">
				<Button className="w-full bg-white text-white opacity-15 font-medium py-2 rounded-md">
					FAQS
				</Button>
				<Button className="w-full bg-white text-black font-medium py-2 rounded-md">
					Join our community
				</Button>
			</div>
		</div>
	);
}
