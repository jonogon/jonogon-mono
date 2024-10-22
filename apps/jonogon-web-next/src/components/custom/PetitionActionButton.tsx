import { useState } from 'react';
import { trpc } from '@/trpc/client';
import { Button } from '../ui/button';
import { useAuthState } from '@/auth/token-manager';
import { useRouter } from 'next/navigation';
import RegulationsModal from './RegulationsModal';

const PetitionActionButton = () => {
    const router = useRouter();
    const authState = useAuthState();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalAccept = () => {
        setIsModalOpen(false);
        handlePetitionCreate();
    };

    return (
        <>
            <Button
                size={'lg'}
                className={'bg-red-500 font-bold shadow-2xl drop-shadow-xl'}
                onClick={handleButtonClick}
            >
                Submit a দাবি
            </Button>
            <RegulationsModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onAccept={handleModalAccept}
            />
        </>
    );
};

export default PetitionActionButton;
