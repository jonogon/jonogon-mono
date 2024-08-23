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
