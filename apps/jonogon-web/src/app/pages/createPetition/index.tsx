import Editor from '@/app/components/custom/richText';
import {Button} from '@/app/components/ui/button';
import {useState} from 'react';

const petitionTopics = [
    'Environmental Protection',
    'Animal Rights',
    'Human Rights',
    'Social Justice',
    'Healthcare Reform',
    'Education Reform',
    'Government Transparency',
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
            <div className="flex gap-3 flex-wrap">
                {petitionTopics.map((topic) => (
                    <Button variant="outline" key={topic}>
                        {topic}
                    </Button>
                ))}
            </div>
            <div className="flex flex-col gap-2 py-4">
                <input
                    type="text"
                    placeholder="Petition Title"
                    className="border outline-none py-2 px-3 rounded-sm text-2xl font-medium"
                />
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
