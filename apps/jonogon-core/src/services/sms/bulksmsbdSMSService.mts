import {TSMSService} from './type.mjs';
import {env} from '../../env.mjs';

export function createBulksmsbdSMSService(): TSMSService {
    return {
        sendSMS: async (number: string, message: string) => {
            if (!env.BULKSMSBD_API_KEY) {
                throw new Error('the bulksmsbd api key is not set');
            }

            const response = await fetch('http://bulksmsbd.net/api/smsapi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: env.BULKSMSBD_API_KEY,
                    senderid: '8809617619973',
                    number: number,
                    message: message,
                }),
            });

            const body = await response.json();

            return body;
        },
    };
}
