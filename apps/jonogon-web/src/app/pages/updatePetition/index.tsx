import Editor from '@/app/components/custom/richText';
import {Button} from '@/app/components/ui/button';
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from '@/app/components/ui/file-upload';
import {Input} from '@/app/components/ui/input';
import {Label} from '@/app/components/ui/label';
import {useToast} from '@/app/components/ui/use-toast';
import {trpc} from '@/app/trpc';
import {useEffect, useState} from 'react';
import {DropzoneOptions} from 'react-dropzone';
import {useLocation, useParams} from 'wouter';

const dropZoneOptions = {
    accept: {
        'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 1 * 1024 * 1024,
} as const satisfies DropzoneOptions;

const UpdatePetition = () => {
    const {toast} = useToast();
    const {petition_id} = useParams();
    const [_location, navigation] = useLocation();
    const [files, setFiles] = useState<File[] | null>([]);

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

    if (prdLoading) {
        return <div>loading</div>;
    }

    return (
        <div className="flex flex-col gap-4 max-w-screen-sm mx-auto pt-5 pb-16 px-4">
            <div className="flex flex-col gap-5 py-4">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Label htmlFor="location">
                        Location
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
                </div> */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        className='bg-card text-card-foreground'
                        id="title"
                        value={petitionData.title}
                        onChange={(e) =>
                            handleUpdateData('title', e.target.value)
                        }
                        placeholder="Ex: Request for Enhanced Funding and Resources for Primary Education in Rural Areas"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">Target Ministry</Label>
                    <Input
                        className='bg-card text-card-foreground'
                        id="target"
                        value={petitionData.target}
                        onChange={(e) =>
                            handleUpdateData('target', e.target.value)
                        }
                        placeholder="Ex- Ministry of Education"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">Image</Label>
                    <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneOptions}>
                        <FileInput>
                            <div className="flex items-center justify-center h-16 w-full border border-neutral-400 text-neutral-600 border-dashed bg-card rounded-md">
                                <p className="text-gray-400">Drop image here</p>
                            </div>
                        </FileInput>
                        <FileUploaderContent className="flex items-center flex-row gap-2">
                            {files?.map((file, i) => (
                                <FileUploaderItem
                                    key={i}
                                    index={i}
                                    className="size-20 p-0 rounded-md overflow-hidden"
                                    aria-roledescription={`file ${i + 1} containing ${file.name}`}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        height={80}
                                        width={80}
                                        className="size-20 p-0"
                                    />
                                </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                    </FileUploader>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Details</Label>
                    <Editor
                        content={petitionData.description}
                        onChange={(val) =>
                            handleUpdateData('description', val)
                        }
                        placeholder="Write your post here..."
                    />
                </div>
                <Button className='font-bold' onClick={handleUpdatePetition}>
                    Save দাবি
                </Button>
            </div>
        </div>
    );
};

export default UpdatePetition;
