import Editor from '@/app/components/custom/richText';
import {useState} from 'react';

const petitionTopics = [
    'Human Rights',
    'Social Justice',
    'Education Reform',
    'Healthcare Reform',
    'Government Transparency',
    'Environmental Protection',
    'Animal Rights',
    'Worker Rights',
    'Gender Equality',
    'Criminal Justice Reform',
    'Gun Control',
    'Immigration Reform',
    'Climate Change Action',
    'Voting Rights',
    'Consumer Rights',
    'Privacy Rights',
    'Affordable Housing',
    'Mental Health Awareness',
    'Disability Rights',
];

const CreatePetition = () => {
    const [value, setValue] = useState('Hello bro!');

    return (
        <div className="container">
            <h2 className="text-3xl mt-5 mb-2">
                Please select the topic that best aligns with your petition
            </h2>
            {/* <div className="flex gap-3 flex-wrap">
                {petitionTopics.map((topic) => (
                    <Button variant="outline" key={topic}>
                        {topic}
                    </Button>
                ))}
            </div> */}
            <div className="flex flex-col gap-3 py-4">
                <input
                    type="text"
                    placeholder="Petition Title"
                    className="border outline-none py-2 px-3 rounded-sm text-2xl font-medium"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Target"
                        className="border outline-none py-2 px-3 rounded-sm font-medium"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        className="border outline-none py-2 px-3 rounded-sm font-medium"
                    />
                </div>
                <Editor
                    content={value}
                    onChange={setValue}
                    placeholder="Write your post here..."
                />
            </div>
        </div>
    );
};

export default CreatePetition;
