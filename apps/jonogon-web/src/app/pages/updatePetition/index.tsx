import Editor from '@/app/components/custom/richText';
import {Button} from '@/app/components/ui/button';
import {Input} from '@/app/components/ui/input';
import {Label} from '@/app/components/ui/label';
import {useToast} from '@/app/components/ui/use-toast';
import {trpc} from '@/app/trpc';
import {useEffect, useState} from 'react';
import {useLocation, useParams} from 'wouter';

const UpdatePetition = () => {
    const {toast} = useToast();
    const {petition_id} = useParams();
    const [, navigation] = useLocation();

    const {mutateAsync: updatePetition} = trpc.petitions.update.useMutation();
    const {data: petitionRemoteData, isLoading: prdLoading} =
        trpc.petitions.get.useQuery({
            id: petition_id!,
        });

    const [petitionData, setPetitionData] = useState({
        target: '',
        location: '',
        title: '',
        description: '',
    });

    useEffect(() => {
        if (petitionRemoteData?.data) {
            setPetitionData({
                target: petitionRemoteData.data.target || '',
                location: petitionRemoteData.data.location || '',
                title: petitionRemoteData.data.title || '',
                description: petitionRemoteData.data.description || '',
            });
        }
    }, [petitionRemoteData]);

    const handleUpdateData = (key: string, val: string) => {
        setPetitionData({...petitionData, [key]: val});
    };

    const handleUpdatePetition = async () => {
        const res = await updatePetition({
            id: Number(petition_id),
            data: petitionData,
        });
        if (res.message === 'updated') {
            toast({
                title: 'Petition Updated!',
                description: 'Petition has been updated successfully!',
            });
            navigation('/petitions/' + petition_id);
        }
    };

    return (
        <div className="h-[calc(100dvh-65px)] overflow-y-auto">
            {prdLoading ? (
                <>loading</>
            ) : (
                <div className="container">
                    <h2 className="text-4xl mt-5 mb-4">
                        Ensure all fields are filled with appropriate text for
                        better reach and impact of your petition.
                    </h2>
                    <div className="flex flex-col gap-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="target">
                                    Enter the name of the ministry you wish to
                                    target
                                </Label>
                                <Input
                                    id="target"
                                    value={petitionData.target}
                                    onChange={(e) =>
                                        handleUpdateData(
                                            'target',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ex- Ministry of Education"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="location">
                                    Enter the location your petition is aimed at
                                </Label>
                                <Input
                                    id="location"
                                    value={petitionData.location}
                                    onChange={(e) =>
                                        handleUpdateData(
                                            'location',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ex- All over Bangladesh"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Enter petition title</Label>
                            <Input
                                id="title"
                                value={petitionData.title}
                                onChange={(e) =>
                                    handleUpdateData('title', e.target.value)
                                }
                                placeholder="Ex- Request for Enhanced Funding and Resources for Primary Education in Rural Areas"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">
                                Describe the key issues and objectives of your
                                petition
                            </Label>
                            <Editor
                                content={petitionData.description}
                                onChange={(val) =>
                                    handleUpdateData('description', val)
                                }
                                placeholder="Write your post here..."
                            />
                        </div>
                        <div className="flex items-center justify-center border border-neutral-400 text-neutral-600 rounded-md border-dashed h-28 select-none cursor-pointer">
                            <div>Upload photos or videos</div>
                        </div>
                        <Button onClick={handleUpdatePetition}>
                            Update petition
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdatePetition;
