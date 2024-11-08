/**
 * Implements a scoring algorithm for petitions based on activity timestamps.
 * This formula allows for a balanced scoring system that rewards both engagement and recency
 */

const SECONDS_IN_DAY = 24 * 3600
/**
* We need EPOCH to calculate vote distribution over time
* Ensures that vote decay happens very gradually and prevents sudden drop
*/
const EPOCH = new Date('2024-08-05').getTime()
const VOTE_DECAY_CONSTANT = 7
const BOOST_WEIGHT = 2
const VOTE_THRESHOLD = 30 // minimum votes needed to be considered in the top of popular list

function dateDiff(date1: number, date2: number): number {
  return ((date2 - date1) / 1000) / (VOTE_DECAY_CONSTANT * SECONDS_IN_DAY)
}
function calculateNoveltyBoost() {
  const newScore = BOOST_WEIGHT 
  const logScore = Math.log(newScore);
  return { logScore, newScore }
}

function calculateVoteVelocity(approvedTime: Date, currentScore:number, voteType: string) {
  const newScore = currentScore + (voteType === 'up' ? 1 : -1);
  const {diff, logValue} = calculateVariables(newScore, approvedTime);
  const logScore = currentScore >= VOTE_THRESHOLD ? logValue + diff : logValue;
  return { logScore, newScore };
}

function calculateCommentVelocity(approvedTime: Date, currentScore: number) {
  const newScore = currentScore + 1;
  const { diff, logValue } = calculateVariables(newScore, approvedTime)
  const logScore = currentScore >= VOTE_THRESHOLD ? logValue + diff : logValue;
  return { logScore, newScore }
}
function calculateVariables(activityValue: number, approvedTime: Date) {
  const validScore = Math.max(activityValue, 1);
  const diff = dateDiff(EPOCH, new Date(approvedTime).getTime());
  const logValue = Math.log(validScore);
  return { diff, logValue }
}
export {calculateVoteVelocity, calculateNoveltyBoost, calculateCommentVelocity};
