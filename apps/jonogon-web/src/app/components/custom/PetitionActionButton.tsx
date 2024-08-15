import {trpc} from '@/app/trpc';
import {observer} from 'mobx-react-lite';
import {useLocation} from 'wouter';
import {Button} from '../ui/button';
import {useAuthState} from '@/app/auth/token-manager';

const PetitionActionButton = observer(() => {
    const authState = useAuthState();
    const [, setLocation] = useLocation();

    const {mutate: createPetition} = trpc.petitions.create.useMutation({
        onSuccess(response) {
            setLocation(`/petitions/${response.data.id}/edit`);
        },
    });

    const handlePetitionCreate = async () => {
        if (!authState) {
            setLocation(`/login?next=${encodeURIComponent('/petitions/new')}`);
        } else {
            createPetition();
        }
    };

    return (
        <Button
            size={'lg'}
            className={'bg-red-500 font-bold shadow-2xl drop-shadow-xl'}
            onClick={handlePetitionCreate}>
            {!authState ? 'Login to Submit a দাবি' : 'Submit a দাবি'}
        </Button>
    );
});

export default PetitionActionButton;
