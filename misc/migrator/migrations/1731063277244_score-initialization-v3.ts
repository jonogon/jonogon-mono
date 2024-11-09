import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';
export const shorthands: ColumnDefinitions | undefined = undefined;

const SECONDS_IN_DAY = 24 * 3600;
const EPOCH = new Date('2024-08-05').getTime();
const VOTE_DECAY_CONSTANT = 7;
const BOOST_WEIGHT = 2;
const VOTE_THRESHOLD = 30;

function dateDiff(date1: number, date2: number): number {
    return ((date2 - date1) / 1000) / (VOTE_DECAY_CONSTANT * SECONDS_IN_DAY);
}

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn(
        'petitions',
        {
            log_score: {type: 'float', default: 0},
        },
        {ifNotExists: true},
    );
    const {rows: petitions} = await pgm.db.query(`
  SELECT id, approved_at FROM petitions WHERE approved_at IS NOT NULL
  `);
    for (const petition of petitions) {
        const petitionId = petition.id;
        const submissionDate = new Date(petition.approved_at).getTime();
        const {rows: votes} = await pgm.db.query(
            `
    SELECT created_at,vote FROM petition_votes WHERE petition_id = $1
    `,
            [petitionId],
        );
        let activityScore = BOOST_WEIGHT;
        for (const vote of votes) {
            activityScore += vote.vote;
        }
        const {rows: comments} = await pgm.db.query(
            `
      SELECT created_at FROM comments WHERE petition_id = $1
    `,
            [petitionId],
        );
        activityScore += comments.length;
        const finalScore = Math.max(activityScore, 1);
        const diff = dateDiff(EPOCH, submissionDate);
        const logScore =
            activityScore >= VOTE_THRESHOLD
                ? Math.log(finalScore) + diff
                : Math.log(finalScore);
        await pgm.db.query(
            `UPDATE petitions SET score = $1,log_score = $2 WHERE id = $3`,
            [activityScore, logScore, petitionId],
        );
    }
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql('UPDATE petitions SET log_score = 0;');
}
