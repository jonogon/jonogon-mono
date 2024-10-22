import { useState } from 'react';
import { trpc } from '@/trpc/client';
import { Button } from '../ui/button';
import { useAuthState } from '@/auth/token-manager';
import { useRouter } from 'next/navigation';

const PetitionActionButton = () => {
    const router = useRouter();
    const authState = useAuthState();

    const { mutate: createPetition } = trpc.petitions.create.useMutation({
        onSuccess(response) {
            router.push(`/petitions/${response.data.id}/edit?fresh=true`);
        },
    });


                    const handlePetitionCreate = async () => {
        if (!authState) {
            router.push('/petition/draft');
        } else {
            createPetition();
        }
    };


    return (
        <>
            <Button
                size={'lg'}
                className={'bg-red-500 font-bold shadow-2xl drop-shadow-xl'}
                onClick={handlePetitionCreate}>
                Submit a দাবি
            </Button>
        </>
    );
};

export default PetitionActionButton;
