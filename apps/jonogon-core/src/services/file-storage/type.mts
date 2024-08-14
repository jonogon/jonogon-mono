import {Readable} from 'node:stream';

export type FStoreFile = (path: string, stream: Readable) => Promise<void>;
export type FGetFileURL = (path: string) => Promise<string>;

export type TFileStorageService = {
    storeFile: FStoreFile;
    getFileURL: FGetFileURL;
};
