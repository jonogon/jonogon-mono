import {makeAutoObservable} from 'mobx';

export type TState = {
    filters: {
        search: string;
        status: 'all' | 'formalized';
        sort: 'latest' | 'oldest' | 'up votes' | 'down votes';
    };
};

export function makeState() {
    return makeAutoObservable<TState>({
        filters: {
            search: '',
            status: 'all',
            sort: 'latest',
        },
    });
}
