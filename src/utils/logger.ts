import { createLogger, format, transports, config } from 'winston';

export const logger = createLogger({
    levels: config.syslog.levels,
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});
