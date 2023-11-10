const winston = require('winston');
const {
    CloudWatchLogs
} = require("@aws-sdk/client-cloudwatch-logs");
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.simple(),
    transports: [
        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '14d', // Keep logs for 14 days
        }),
    ],
});

const cloudwatchLogs = new CloudWatchLogs({
    region: process.env.AWS_REGION
});

const logGroupName = `webapp/${process.env.AWS_REGION}`;
const logStreamName = `webapp-Instance-${Date.now()}`;

async function createLogGroupAndStream() {
    await cloudwatchLogs.createLogGroup({ logGroupName });
    await cloudwatchLogs.createLogStream({ logGroupName, logStreamName });
}

async function sendLogMessage(message) {
    await createLogGroupAndStream();
    const logEvents = [{ message, timestamp: Date.now() }];
    await cloudwatchLogs.putLogEvents({ logGroupName, logStreamName, logEvents });
}

module.exports = {
    logger, sendLogMessage
};