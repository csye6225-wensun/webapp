const Sequelize = require('sequelize');

const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = require('./model')(sequelize, Sequelize);

db.accounts = models.Account;
db.assignments = models.Assignment;

module.exports = db;