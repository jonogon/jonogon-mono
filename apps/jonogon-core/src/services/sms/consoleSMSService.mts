import {TSMSService} from './type.mjs';
import {logger} from '../../logger.mjs';

export function createConsoleSMSService(): TSMSService {
    return {
        sendSMS: async (number: string, message: string) => {
            logger.debug(`--------> SMS ${number}: ${message}`);
        },
    };
}
