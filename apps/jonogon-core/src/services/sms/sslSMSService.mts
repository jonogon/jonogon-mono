import {TSMSService} from './type.mjs';

export function createSSLSMSService(): TSMSService {
    return {
        sendSMS: async (number: string, message: string) => {
            throw new Error(`not implemented yet - ${number}: ${message}`);
        },
    };
}
