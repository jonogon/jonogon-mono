import useRerenderInterval from '@/lib/useRerenderInterval';

function getNextMondayMidnight() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    const daysUntilTuesday = (1 - dayOfWeek + 7) % 7 || 7; // Find how many days until the next Monday

    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilTuesday);
    nextMonday.setHours(0, 0, 0, 0);

    return nextMonday;
}

export function CountDown() {
    useRerenderInterval(1000);

    const nextMonday = getNextMondayMidnight().getTime();
    const timeLeft = nextMonday - Date.now();

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <span className={'space-x-1'}>
            {days > 0 ? (
                <span>
                    {days} {days > 1 ? 'days' : 'day'},
                </span>
            ) : null}
            {hours > 0 ? (
                <span>
                    {hours} {hours > 1 ? 'hours' : 'hour'},
                </span>
            ) : null}
            {minutes > 0 ? (
                <span>
                    {minutes} {minutes > 1 ? 'minutes' : 'minute'}, and
                </span>
            ) : null}
            {seconds > 0 ? (
                <span>
                    {seconds} {seconds > 1 ? 'seconds' : 'second'}
                </span>
            ) : null}
        </span>
    );
}
