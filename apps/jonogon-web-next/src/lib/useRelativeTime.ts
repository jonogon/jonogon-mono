import {useState, useEffect} from 'react';

export function useRelativeTime(date: Date | string) {
    const [relativeTime, setRelativeTime] = useState<string>('');

    useEffect(() => {
        function getRelativeTime(date: Date | string) {
            const now = new Date();
            const past = new Date(date);
            const diff = now.getTime() - past.getTime();

            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30);
            const years = Math.floor(months / 12);

            if (seconds < 60) return 'now';
            if (minutes < 60) return `${minutes}m`;
            if (hours < 24) return `${hours}h`;
            if (days < 30) return `${days}d`;
            if (months < 12) return `${months}M`;
            return `${years}y`;
        }

        // Update relative time immediately
        setRelativeTime(getRelativeTime(date));

        // Update relative time every minute
        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(date));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [date]);

    return relativeTime;
}
