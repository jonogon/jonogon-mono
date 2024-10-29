import {SelectType} from 'kysely';
import {Petitions} from '../postgres/types.mjs';

export function deriveStatus(petition: {
    approved_at: SelectType<Petitions['approved_at']>;
    formalized_at: SelectType<Petitions['formalized_at']>;
    rejected_at: SelectType<Petitions['rejected_at']>;
    flagged_at: SelectType<Petitions['flagged_at']>;
    submitted_at: SelectType<Petitions['submitted_at']>;
}) {
    if (petition.formalized_at) {
        return 'formalized' as const;
    }

    if (petition.approved_at) {
        return 'approved' as const;
    }

    if (petition.rejected_at) {
        return 'rejected' as const;
    }

    if (petition.flagged_at) {
        return 'flagged' as const;
    }

    if (petition.submitted_at) {
        return 'submitted' as const;
    }

    return 'draft' as const;
}
