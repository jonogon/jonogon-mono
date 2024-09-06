export const generateDescription = (totalVoteCount: number) => {
    if (totalVoteCount === 1) {
        return `Vote on this petition and join 1 citizen in reforming Bangladesh.`;
    } else if (totalVoteCount > 1) {
        return `Vote on this petition and join ${totalVoteCount} citizens in reforming Bangladesh.`;
    } else {
        return `Be the first to vote on this petition and help reform Bangladesh.`;
    }
};
