import {Button} from '@/app/components/ui/button';
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from '@/app/components/ui/file-upload';
import {Input} from '@/app/components/ui/input';
import {Label} from '@/app/components/ui/label';
import {useToast} from '@/app/components/ui/use-toast';
import {trpc} from '@/app/trpc';
import {useCallback, useState} from 'react';
import {DropzoneOptions} from 'react-dropzone';
import {useLocation, useParams} from 'wouter';
import useQueryParams from 'react-use-query-params';

const dropZoneOptions = {
    accept: {
        'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: true,
    maxFiles: 4,
    maxSize: 1 * 1024 * 1024,
} as const satisfies DropzoneOptions;

const UpdatePetition = () => {
    const [params, setParams] = useQueryParams<{
        fresh: string;
    }>();

    const {toast} = useToast();
    const {petition_id} = useParams();
    const [, setLocation] = useLocation();
    const [files, setFiles] = useState<File[] | null>([]);

    const {mutate: updatePetition, isLoading: isPetitionSaving} =
        trpc.petitions.update.useMutation({
            onSuccess: async () => {
                setLocation(`/petitions/${petition_id}`);
            },
        });

    const {data: petitionRemoteData, isLoading: isPetitionLoading} =
        trpc.petitions.get.useQuery({
            id: petition_id!,
        });

    const [nextPetitionData, setNextPetitionData] = useState<{
        target?: string;
        location?: string;
        title?: string;
        description?: string;
    }>({});

    const petitionData = {
        target:
            nextPetitionData.target ?? petitionRemoteData?.data.target ?? '',
        location:
            nextPetitionData.location ??
            petitionRemoteData?.data.location ??
            '',
        title: nextPetitionData.title ?? petitionRemoteData?.data.title ?? '',
        description:
            nextPetitionData.description ??
            petitionRemoteData?.data.description ??
            '',
    };

    const handleUpdateData = useCallback(
        (key: keyof typeof nextPetitionData, val: string) => {
            setNextPetitionData((nextPetitionData) => ({
                ...nextPetitionData,
                [key]: val,
            }));
        },
        [setNextPetitionData],
    );

    const handleUpdatePetition = () => {
        updatePetition({
            id: Number(petition_id),
            data: nextPetitionData,
        });
    };

    return (
        <div className="flex flex-col gap-4 max-w-screen-sm mx-auto pt-5 pb-16 px-4">
            <h1
                className={
                    'text-5xl py-12 md:py-10 font-regular text-stone-600 leading-0'
                }>
                {'fresh' in params ? '✊ Create New দাবি' : '✊ Update দাবি'}
            </h1>
            <div className="flex flex-col gap-5 py-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">
                        <div className={'font-bold text-lg'}>Title *</div>
                        <div className={'text-stone-500'}>
                            আপনার আবেদনের শিরোনাম লিখুন
                        </div>
                    </Label>
                    <Input
                        className="bg-card text-card-foreground text-2xl py-7"
                        id="title"
                        value={petitionData.title}
                        onChange={(e) =>
                            handleUpdateData('title', e.target.value)
                        }
                        placeholder="Ex: Make Primary Education Better"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">
                        <div className={'font-bold text-lg'}>
                            Who are you petitioning to? *
                        </div>
                        <div className={'text-stone-500'}>
                            আপনি কার কাছে দাবি করছেন?
                        </div>
                    </Label>
                    <Input
                        className="bg-card text-card-foreground"
                        id="target"
                        value={petitionData.target}
                        onChange={(e) =>
                            handleUpdateData('target', e.target.value)
                        }
                        placeholder="Ex: Minister, Ministry, Department, Politician, Prime Minister"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">
                        <div className={'font-bold text-lg'}>
                            Area it affects *
                        </div>
                        <div className={'text-stone-500'}>
                            কন এলাকার মানুষের জন্য প্রযোজ্য?
                        </div>
                    </Label>
                    <Input
                        className="bg-card text-card-foreground"
                        id="target"
                        value={petitionData.location}
                        onChange={(e) =>
                            handleUpdateData('location', e.target.value)
                        }
                        placeholder="Ex: Entire Bangladesh"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="target">
                        <div className={'font-bold text-lg'}>
                            Pictures{' '}
                            <span
                                className={'font-light italic text-stone-600'}>
                                (optional)
                            </span>
                        </div>
                        <div className={'text-stone-500'}>
                            কন এলাকার মানুষের জন্য প্রযোজ্য?
                        </div>
                    </Label>
                    <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneOptions}>
                        <FileInput>
                            <div className="flex items-center justify-center h-16 w-full border border-neutral-400 text-neutral-600 border-dashed bg-card rounded-md">
                                <p className="text-gray-400">
                                    Drop Images Here
                                </p>
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
                    <Label>
                        <div className={'font-bold text-lg'}>
                            Petition Details
                        </div>
                        <div className={'text-stone-500'}>বিস্তারিত লিখুন</div>
                    </Label>
                    <textarea
                        className={'font-mono p-3 h-48'}
                        placeholder={'Enter Details Here...'}
                        value={petitionData.description}
                        onChange={(e) =>
                            handleUpdateData('description', e.target.value)
                        }></textarea>
                </div>
                <Button
                    size={'lg'}
                    disabled={isPetitionSaving}
                    onClick={handleUpdatePetition}>
                    Save দাবি
                </Button>
            </div>
        </div>
    );
};

export default UpdatePetition;
