const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const logger = require('./logger');

const snsClient = new SNSClient({ region: process.env.REGION });
const topicArn = process.env.SNS_ARN;

function publishToSNS(message) {
    if (process.env.REGION == "none") {
        return;
    }
    const command = new PublishCommand({
        TopicArn: topicArn,
        Message: message,
    });

    snsClient.send(command)
        .then((data) => {
            logger.info(`Message (${message}) published successfully: ${data}`);
        })
        .catch((err) => {
            logger.error(err);
        });
}

module.exports = {
    publishToSNS
};