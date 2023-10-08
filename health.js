const Sequelize = require('sequelize');

const dbconfig = require('./config/db.config');

async function getHealthz(req, res) {
    const sequelize = new Sequelize(dbconfig.db, dbconfig.user, dbconfig.password, {
        host: dbconfig.host,
        dialect: dbconfig.dialect
    });

    try {
        await sequelize.authenticate();
        res.status(200).send("");
    } catch (error) {
        res.status(503).send("");
    } finally {
        sequelize.close()
    }
}

module.exports = {
    getHealthz
};