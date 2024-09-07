import {ThumbsUp, ChevronDown, ChevronUp} from 'lucide-react';
import Image from 'next/image';
import {Button} from '../ui/button';
import {trpc} from '@/trpc/client';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {fixedContributors} from '@/lib/contributors';

export default function About({setOpen}: {setOpen: (open: boolean) => void}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const handleModalClose = () => {
        setOpen(false);
        router.push('/contributors');
    };

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setIsOpen(isDesktop);
    }, [isDesktop]);

    const toggleCollapsible = () => {
        setIsOpen(!isOpen);
    };

    const {data: dynamicContributors = [], isLoading} =
        trpc.users.getAllUserNames.useQuery();

    const combinedContributors = [
        ...fixedContributors,
        ...dynamicContributors.map(
            (contributor) => contributor.name ?? 'Anonymous',
        ),
    ].slice(0, 20);

    const isFixedContributor = (name: string) =>
        fixedContributors.includes(name);

    return (
        <div className="flex flex-col overflow-y-auto md:overflow-y-visible">
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

                    <div className="mt-6 text-white font-light gap-4">
                        <Collapsible
                            open={isOpen}
                            onOpenChange={toggleCollapsible}
                            className="flex flex-col gap-4"
                        >
                            <CollapsibleTrigger className="flex justify-between items-center">
                                <p className="font-medium text-left">
                                    Jonogon is built for the people, by the
                                    people.
                                </p>
                                {/* Icon that changes based on whether the collapsible is open or closed */}
                                {isOpen ? (
                                    <ChevronUp className="text-white w-5 h-5" />
                                ) : (
                                    <ChevronDown className="text-white w-5 h-5" />
                                )}
                            </CollapsibleTrigger>
                            <CollapsibleContent className="flex flex-col gap-4">
                                <p>
                                    We consist of{' '}
                                    <span className="font-medium">
                                        2500+ citizens (and growing)
                                    </span>{' '}
                                    who believe in a secular and effective
                                    Bangladesh, which stands for truth against
                                    violence, hatred, crime, and discrimination.
                                </p>
                                <p>
                                    A Bangladesh where everyone is free to speak
                                    without fear.
                                </p>
                                <p>
                                    A Bangladesh where reform takes place in
                                    days, not decades.
                                </p>
                                <p>
                                    A Bangladesh that works together to open
                                    doors of opportunity for every citizen.
                                </p>
                                <p>
                                    Contribute to this new Bangladesh by
                                    submitting your দাবি today <br />{' '}
                                    <span className="font-medium">
                                        — we’ll ensure your voice matters and
                                        leads to action.
                                    </span>
                                </p>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-1/2 md:border-l border-white border-opacity-20 pt-4 md:pt-0 md:pl-8 gap-4">
                    <p className="text-white font-medium text-xl">
                        Our Contributors:
                    </p>
                    <ul className="list-disc list-inside md:columns-2 space-y-1 text-white font-light">
                        {isLoading ? (
                            <li>Loading...</li>
                        ) : combinedContributors.length > 0 ? (
                            combinedContributors.map((contributor, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    {contributor}
                                    {isFixedContributor(contributor) && (
                                        <span>☆</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li>No contributors found</li>
                        )}
                    </ul>

                    {combinedContributors.length === 20 && (
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-red-500"
                            onClick={() => handleModalClose()}
                        >
                            See All
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-row gap-4 md:border-t border-white border-opacity-20 py-4">
                <Button className="w-full bg-[#F7F2EE] bg-opacity-10 text-white font-medium py-4 rounded-md border-2 border-black border-opacity-10">
                    FAQS
                </Button>
                <Button className="w-full bg-[#F7F2EE] bg-opacity-10 text-white font-medium py-4 rounded-md border-2 border-black border-opacity-10">
                    Join our community
                </Button>
            </div>
        </div>
    );
}
