import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
export const shorthands: ColumnDefinitions | undefined = undefined;

const SECONDS_IN_DAY: number = 24 * 3600;
const EPOCH: number = new Date('2074-08-05').getTime();
const BOOST_WEIGHT = 20;
const VOTE_WEIGHT = 55;
const COMMENT_WEIGHT = 25;
const VOTE_DECAY_CONSTANT = 0.5;
const COMMENT_DECAY_CONSTANT = 0.2;

function dateDiffInDays(date1: number, date2: number): number {
  return Math.floor((date2 - date1) / (1000 * SECONDS_IN_DAY));
}
function calculateTimeWeight(dateTime: Date) {
  const activityTime = new Date(dateTime).getTime();
  const activityAge = dateDiffInDays(activityTime, EPOCH);
  return 1 / (activityAge + 1);
}
function postOlderThan30Days(activityDate: Date, submissionDate: Date) {
  const days = dateDiffInDays(new Date(submissionDate).getTime(), new Date(activityDate).getTime())
  return days > 30
}

function calculateNoveltyBoost(petitionSubmissionDate: Date) {
  return BOOST_WEIGHT * calculateTimeWeight(petitionSubmissionDate);
}

function calculateVoteVelocity(dateTime: Date, approvedTime: Date, currentScore: number, voteType: number) {
  const sign = voteType === 1 ? 1 : -1
  const weight = postOlderThan30Days(dateTime, approvedTime)
      ? VOTE_DECAY_CONSTANT
      : 1;
  return currentScore + (weight * sign * VOTE_WEIGHT * calculateTimeWeight(dateTime))
}

function calculateCommentVelocity(dateTime: Date,approvedTime: Date, currentScore: number) {
  const weight = postOlderThan30Days(dateTime, approvedTime)
      ? COMMENT_DECAY_CONSTANT
      : 1;
  return currentScore + (weight * COMMENT_WEIGHT * calculateTimeWeight(dateTime))
}

export async function up(pgm: MigrationBuilder): Promise<void> {
  const { rows: petitions } = await pgm.db.query(`
  SELECT id, approved_at FROM petitions WHERE approved_at IS NOT NULL
  `);
  for (const petition of petitions) {
    const petitionId = petition.id;
    const submissionDate = new Date(petition.approved_at);
    let totalScore = calculateNoveltyBoost(submissionDate);
    const { rows: votes } = await pgm.db.query(
      `
    SELECT created_at,vote FROM petition_votes WHERE petition_id = $1
    `,
      [petitionId],
    );
    for (const vote of votes) {
      totalScore = calculateVoteVelocity(
        new Date(vote.created_at),
        submissionDate,
        totalScore,
        vote.vote
      );
    }
    const { rows: comments } = await pgm.db.query(
      `
    SELECT created_at FROM comments WHERE petition_id = $1
    `,
      [petitionId],
    );
    for (const comment of comments) {
      totalScore = calculateCommentVelocity(
        new Date(comment.created_at),
        submissionDate,
        totalScore,
      );
    }
    await pgm.db.query(`UPDATE petitions SET score = $1 WHERE id = $2`, [
      totalScore,
      petitionId,
    ]);
  }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql('UPDATE petitions SET score = 0;');
}
