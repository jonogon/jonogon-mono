import {ChangeEvent, useCallback, useState} from 'react';
import {Input} from '@/app/components/ui/input.tsx';
import {Button} from '@/app/components/ui/button.tsx';
import {useMutation} from '@tanstack/react-query';
import {useTokenManager} from '@/app/auth/token-manager.tsx';
import {cn} from '@/app/lib/utils.ts';
import {trpc} from '@/app/trpc';
import {useLocation} from 'wouter';

export default function ProfileUpdate() {
    const utils = trpc.useUtils();
    const {data: selfDataResponse} = trpc.users.getSelf.useQuery(undefined);
    const pictureURL = selfDataResponse?.data.picture_url
        ? selfDataResponse?.data.picture_url.replace(
              '$CORE_HOSTNAME',
              window.location.hostname,
          )
        : null;

    const [name, setName] = useState<null | string>(null);
    const {get: getToken} = useTokenManager();

    const resolvedName = name ?? selfDataResponse?.data.name ?? '';

    const updateName = useCallback(
        (ev: ChangeEvent<HTMLInputElement>) => {
            setName(ev.target.value.trimStart().replace(/\s+/g, ' '));
        },
        [setName],
    );

    const valid =
        resolvedName
            .split(' ')
            .map((c) => c.trim())
            .filter((c) => c.length >= 2).length >= 2;

    const {mutate: uploadPhoto, isLoading: isPictureLoading} = useMutation({
        mutationFn: async (data: {file: File}) => {
            await fetch(
                import.meta.env.DEV
                    ? `http://${window.location.hostname}:12001/users/self/picture`
                    : 'https://core.jonogon.org/users/self/picture',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        Authorization: `Bearer ${await getToken()}`,
                    },
                    body: data.file,
                },
            );
        },
        onSuccess: async () => {
            await utils.users.getSelf.invalidate();
            window.document.getElementById('name')?.focus?.();
        },
    });

    const [, setLocation] = useLocation();

    const {mutate: save, isLoading: isSaveLoading} =
        trpc.users.updateSelf.useMutation({
            onSuccess: async () => {
                await utils.users.getSelf.invalidate();
                setLocation('/');
            },
        });

    const triggerSave = () => {
        save({
            name: resolvedName.trim(),
        });
    };

    return (
        <div className="max-w-screen-sm mx-auto px-4 flex flex-col justify-center space-y-6">
            <h1
                className={
                    'text-4xl py-16 md:py-16 font-regular text-stone-600 leading-0'
                }>
                🎭 আপনার Profile সম্পূর্ণ করুন
            </h1>
            <div className={'space-y-2'}>
                <label htmlFor={'image'} className={'cursor-pointer'}>
                    <div className={'font-bold text-lg'}>Picture</div>
                    <div className={'text-stone-600'}>
                        নিজের একটি ছবি upload করুন
                    </div>
                </label>
                <div
                    className={cn(
                        'w-32 h-32 flex justify-center items-center rounded-full border-8 relative cursor-pointer bg-contain bg-center',
                    )}
                    style={
                        pictureURL
                            ? {
                                  backgroundImage: `url('${pictureURL}')`,
                              }
                            : {}
                    }>
                    {isPictureLoading ? (
                        <div
                            className={
                                'animate-spin border-4 border-b-transparent border-l-transparent border-red-500 w-8 h-8 rounded-full'
                            }></div>
                    ) : (
                        <span
                            className={
                                'text-5xl text-stone-400 drop-shadow-sm'
                            }>
                            +
                        </span>
                    )}

                    <input
                        id={'image'}
                        type={'file'}
                        className={
                            'w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer'
                        }
                        accept={'image/*'}
                        onChange={(ev) => {
                            if (ev.target.files?.length) {
                                uploadPhoto({file: ev.target.files[0]});
                            }
                        }}
                    />
                </div>
            </div>
            <div className={'space-y-2'}>
                <label htmlFor={'name'}>
                    <div className={'font-bold text-lg'}>Your Full Name</div>
                    <div className={'text-stone-600'}>আপনার নাম লিখুন</div>
                </label>
                <Input
                    placeholder={'রাকিব আল হাসান'}
                    id={'name'}
                    className={'bg-white text-xl py-8'}
                    value={resolvedName}
                    onChange={updateName}
                />
            </div>
            <div className={'flex flex-row justify-end'}>
                <Button
                    size={'lg'}
                    disabled={!valid || isSaveLoading}
                    className={'w-full md:w-2/4'}
                    onClick={triggerSave}>
                    Complete — সম্পূর্ণ করুন
                </Button>
            </div>
        </div>
    );
}
