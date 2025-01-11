export const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();

    // Determine the correct suffix for the day
    const getDaySuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th'; // 4th to 20th

        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };

    return `${day}${getDaySuffix(day)} ${month}, ${year}`;
};

export const formatFullDateTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

export const formatFullDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
