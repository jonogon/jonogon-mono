export type FSendSMS = (number: string, message: string) => Promise<void>;

export type TSMSService = {
    sendSMS: FSendSMS;
};
