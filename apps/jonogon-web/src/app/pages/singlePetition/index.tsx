import {trpc} from '@/app/trpc';
import {useParams} from 'wouter';
import {TbTargetArrow} from 'react-icons/tb';
import {SiRelay} from 'react-icons/si';

const SinglePetition = () => {
    const {petition_id} = useParams();
    const {data: petition} = trpc.petitions.get.useQuery({
        id: petition_id!!,
    });
    return (
        <div className="container">
            <h2 className="text-4xl mt-6 mb-3">{petition?.data.title}</h2>
            <div className="flex items-center gap-3 font-medium mb-7 text-neutral-700">
                <div className="flex items-center gap-2 border-r border-neutral-700 pr-3">
                    <TbTargetArrow />
                    <span>{petition?.data.target}</span>
                </div>
                <div className="flex items-center gap-2">
                    <SiRelay />
                    <span>{petition?.data.location}</span>
                </div>
            </div>
            {petition?.data.description && (
                <p
                    dangerouslySetInnerHTML={{
                        __html: petition?.data.description,
                    }}></p>
            )}
        </div>
    );
};

export default SinglePetition;
