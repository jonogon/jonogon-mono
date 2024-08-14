import {trpc} from '@/app/trpc';
import {observer} from 'mobx-react-lite';
import {useLocation} from 'wouter';
import {Button} from '../ui/button';
import {useAuthState} from '@/app/auth/token-manager';

const PetitionActionButton = observer(() => {
    const authState = useAuthState();
    const [location, navigate] = useLocation();

    const {mutateAsync: createPetition} = trpc.petitions.create.useMutation();

    const handlePetitionCreate = async () => {
        const {
            data: {id: petitionId},
        } = await createPetition();
        console.log([petitionId]);
        navigate('petitions/' + petitionId + '/edit');
    };

    return (
        <Button
            size={'lg'}
            onClick={() => {
                if (!authState) {
                    navigate('/login');
                    return;
                }

                if (location !== '/') {
                    navigate('/');
                    return;
                } else {
                    handlePetitionCreate();
                    return;
                }
            }}>
            {!authState
                ? 'Login to submit petition'
                : location !== '/'
                  ? 'Browse petitions'
                  : 'Submit petition'}
        </Button>
    );
});

export default PetitionActionButton;
