const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: process.env.LOG_FILE_PATH,
            level: process.env.LOG_LEVEL,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

module.exports = logger;