export const generateDescription = (numberOfUsers: number) => {
    if (numberOfUsers === 1) {
        return `Vote on this petition and join 1 citizen in reforming Bangladesh.`;
    } else if (numberOfUsers > 1) {
        return `Vote on this petition and join ${numberOfUsers} citizens in reforming Bangladesh.`;
    } else {
        return `Be the first to vote on this petition and help reform Bangladesh.`;
    }
};
