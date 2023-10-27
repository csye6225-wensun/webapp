const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = require('./model')(sequelize, Sequelize);

db.accounts = models.Account;
db.assignments = models.Assignment;

module.exports = db;