import Editor from '@/app/components/custom/richText';
import {Input} from '@/app/components/ui/input';
import {Label} from '@/app/components/ui/label';
import {useState} from 'react';

const UpdatePetition = () => {
    const [value, setValue] = useState('');

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
            <div className="flex flex-col gap-5 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="target">
                            Enter the name of the ministry you wish to target
                        </Label>
                        <Input
                            id="target"
                            name="target"
                            placeholder="Ex- Ministry of Education"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="location">
                            Enter the location your petition is aimed at
                        </Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="Ex- Rajshahi Board"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">Enter petition title</Label>
                    <Input
                        id="target"
                        name="target"
                        placeholder="Ex- Request for Enhanced Funding and Resources for Primary Education in Rural Areas"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">
                        Describe the key issues and objectives of your petition
                    </Label>
                    <Editor
                        content={value}
                        onChange={setValue}
                        placeholder="Write your post here..."
                    />
                </div>

                <div className="flex items-center justify-center border border-neutral-400 text-neutral-600 rounded-md border-dashed h-28 select-none cursor-pointer">
                    <div>Upload photos or videos</div>
                </div>
                <div className="flex items-center ">
                    <div>Submit</div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePetition;
