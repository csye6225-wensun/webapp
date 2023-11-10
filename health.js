const Sequelize = require('sequelize');
const { logger, } = require('./logger');

async function getHealthz(req, res) {
    const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        logging: false
    });

    try {
        await sequelize.authenticate();
        res.status(200).send("");
    } catch (error) {
        logger.error(error);
        res.status(503).send("");
    } finally {
        sequelize.close()
    }
}

module.exports = {
    getHealthz
};