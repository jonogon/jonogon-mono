import {SelectType} from 'kysely';
import {Petitions} from '../postgres/types.mjs';

export function deriveStatus(petition: {
    approved_at: SelectType<Petitions['approved_at']>;
    formalized_at: SelectType<Petitions['formalized_at']>;
    rejected_at: SelectType<Petitions['rejected_at']>;
    submitted_at: SelectType<Petitions['submitted_at']>;
}) {
    if (petition.formalized_at) {
        return 'formalized';
    }

    if (petition.approved_at) {
        return 'approved';
    }

    if (petition.rejected_at) {
        return 'rejected';
    }

    if (petition.submitted_at) {
        return 'submitted';
    }

    return 'draft';
}