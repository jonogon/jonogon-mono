import {useState, useEffect} from 'react';
import {formatDistanceToNowStrict, differenceInSeconds} from 'date-fns';

export function useRelativeTime(date: Date | string) {
    const [relativeTime, setRelativeTime] = useState<string>('');

    useEffect(() => {
        function getRelativeTime(date: Date | string) {
            const seconds = differenceInSeconds(new Date(), new Date(date));
            if (seconds < 60) return 'now';
            return formatDistanceToNowStrict(new Date(date));
        }

        setRelativeTime(getRelativeTime(date));
        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(date));
        }, 60000);

        return () => clearInterval(interval);
    }, [date]);

    return relativeTime;
}
