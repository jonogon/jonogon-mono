export function getSortType(sortStr: string | null) {
    switch (sortStr) {
        case 'score':
        case 'time':
        case 'votes':
            return sortStr;
        default:
            return null;
    }
}

export function getDabiType(typeStr: string | null) {
    switch (typeStr) {
        case 'own':
        case 'formalized':
        case 'request':
            return typeStr;
        default:
            return 'request';
    }
}

// maybe move somewhere else and rename??
export function getDefaultSortForDabiType(
    sort: ReturnType<typeof getSortType>,
    type: ReturnType<typeof getDabiType>,
) {
    if (type === 'own') {
        switch (sort) {
            case 'score':
            case 'votes':
            case 'time':
                return sort;
            default:
                return 'time';
        }
    }

    switch (sort) {
        case 'score':
        case 'votes':
        case 'time':
            return sort;
        default:
            return 'votes';
    }
}

export function getDefaultSortLabelForDabiType(
    sort: ReturnType<typeof getSortType>,
    type: ReturnType<typeof getDabiType>,
) {
    if (type === 'own') {
        switch (sort) {
            case 'score':
                return 'Popular';
            case 'votes':
                return 'বেশি Votes';
            case 'time':
            default:
                return 'Latest';
        }
    }

    switch (sort) {
        case 'votes':
            return 'বেশি Votes';
        case 'time':
            return 'Latest';
        case 'score':
        default:
            return 'Popular';
    }
}
