import {Button} from '@/app/components/ui/button';
import {Input} from '@/app/components/ui/input';
import {Label} from '@/app/components/ui/label';
import {trpc} from '@/app/trpc';
import {useCallback, useEffect, useState} from 'react';
import {useLocation, useParams} from 'wouter';
import useQueryParams from 'react-use-query-params';
import {scope} from 'scope-utilities';
import {useMutation} from '@tanstack/react-query';
import {useTokenManager} from '@/app/auth/token-manager.tsx';

const UpdatePetition = () => {
    const {get: getToken} = useTokenManager();
    const utils = trpc.useUtils();

    const [params, setParams] = useQueryParams<{
        fresh: string;
    }>();

    const {petition_id} = useParams();
    const [, setLocation] = useLocation();

    const [attachmentQueue, setAttachmentQueue] = useState<
        {
            type: 'image' | 'attachment';
            file: File;
        }[]
    >([]);

    const removeOne = useCallback(
        (type: 'image' | 'attachment') => {
            setAttachmentQueue((queue) => {
                const lastIndex = queue.findLastIndex(
                    (attachment) => attachment.type === type,
                );

                return queue.filter((_attachment, i) => i !== lastIndex);
            });
        },
        [setAttachmentQueue],
    );

    const {mutate: updatePetition, isLoading: isPetitionSaving} =
        trpc.petitions.update.useMutation({
            onSuccess: async () => {
                await utils.petitions.get.invalidate({id: petition_id});
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

    const {mutate: uploadAttachment} = useMutation({
        mutationFn: async (data: {type: 'image' | 'file'; file: File}) => {
            const search = new URLSearchParams({
                type: data.type,
                filename: data.file.name,
            });

            const response = await fetch(
                import.meta.env.DEV
                    ? `http://${window.location.hostname}:12001/petitions/${petition_id}/attachments?${search}`
                    : `https://core.jonogon.org/petitions/${petition_id}/attachments?${search}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        Authorization: `Bearer ${await getToken()}`,
                    },
                    body: data.file,
                },
            );

            return (await response.json()) as {
                message: 'image-added' | 'attachment-added';
            };
        },
        onSuccess: async (response) => {
            if (response.message === 'image-added') {
                removeOne('image');
            } else {
                removeOne('attachment');
            }

            await utils.petitions.get.invalidate({id: petition_id});
        },
    });

    useEffect(() => {
        if (!attachmentQueue.length) {
            return;
        }

        const attachment = attachmentQueue[attachmentQueue.length - 1];

        uploadAttachment({
            type: attachment.type === 'image' ? 'image' : 'file',
            file: attachment.file,
        });
    }, [attachmentQueue]);

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
                    <Label htmlFor="pictures">
                        <div className={'font-bold text-lg'}>
                            Pictures{' '}
                            <span
                                className={'font-light italic text-stone-600'}>
                                (optional)
                            </span>
                        </div>
                        <div className={'text-stone-500'}>
                            কিছু ছবি upload করতে পারেন
                        </div>
                    </Label>
                    <div className={'flex flex-row flex-wrap gap-2'}>
                        <div
                            className={
                                'flex justify-center items-center border-4 w-24 h-20 rounded-lg relative bg-card hover:bg-card/30 cursor-pointer'
                            }>
                            <span
                                className={
                                    'text-5xl text-stone-400 drop-shadow-sm cursor-pointer'
                                }>
                                +
                            </span>
                            <input
                                id={'pictures'}
                                type={'file'}
                                multiple
                                accept={'image/*'}
                                className={
                                    'absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                                }
                                onChange={(ev) => {
                                    setAttachmentQueue((queue) => [
                                        ...queue,
                                        ...scope(ev.target.files).let(
                                            (files) => {
                                                if (!files) {
                                                    return [];
                                                }

                                                const attachments = [];

                                                for (const file of files) {
                                                    attachments.push({
                                                        type: 'image' as const,
                                                        file: file,
                                                    });
                                                }

                                                return attachments;
                                            },
                                        ),
                                    ]);
                                }}
                            />
                        </div>

                        {attachmentQueue
                            .filter((attachment) => attachment.type === 'image')
                            .map(() => (
                                <div
                                    className={
                                        'flex justify-center items-center border-4 w-24 h-20 rounded-lg'
                                    }>
                                    <div
                                        className={
                                            'animate-spin border-4 border-b-transparent border-l-transparent border-red-500 w-8 h-8 rounded-full'
                                        }></div>
                                </div>
                            ))}

                        {petitionRemoteData?.data?.attachments
                            .filter((attachment) => attachment.type === 'image')
                            .map((attachment) => (
                                <div
                                    className={
                                        'flex justify-center items-center border-4 w-24 h-20 rounded-lg bg-black'
                                    }>
                                    <img
                                        src={attachment.thumbnail!!.replace(
                                            '$CORE_HOSTNAME',
                                            window.location.hostname,
                                        )}
                                        alt={attachment.filename}
                                        className={
                                            'w-full h-full object-contain object-center'
                                        }
                                    />
                                </div>
                            ))}
                    </div>
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
