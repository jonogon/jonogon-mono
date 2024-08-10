import {useAuthState} from '../auth/token-manager.tsx';

export default function Index() {
    const authState = useAuthState();

    return `Homepage ${authState}`;
}
