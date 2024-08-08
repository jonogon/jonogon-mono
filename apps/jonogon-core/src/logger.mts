import winston from 'winston';

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: {service: 'jonogon-core'},
    transports: [new winston.transports.Console()],
});
