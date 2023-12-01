const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const logger = require('./logger');

const snsClient = new SNSClient({ region: process.env.REGION });

async function publishToSNS(message) {
    if (process.env.REGION == "none") {
        return;
    }

    try {
        const response = await snsClient.send(
            new PublishCommand({
                Message: message,
                TopicArn: process.env.SNS_ARN,
            }),
        );
        logger.info(`Message (${message}) TopicArn (${process.env.SNS_ARN}) published successfully: `, response);
    } catch (err) {
        logger.error("Publish to SNS fail: ", err);
    }
}

module.exports = {
    publishToSNS
};