const fs = require("fs");
const csv = require('csv-parser');
const bcrypt = require("bcrypt");
const getStream = require('get-stream');
const logger = require('./logger');

const saltRounds = 10;

async function initAccount(db) {
    const parser = fs.createReadStream('./opt/users.csv').pipe(csv())
    const rows = await getStream.array(parser);
    const d = new Date();
    for (const row of rows) {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(row.password, saltRounds, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });
        await db.accounts.create({
            first_name: row.first_name,
            last_name: row.last_name,
            password: hashedPassword,
            email: row.email,
            account_created: d.toString(),
            account_updated: d.toString()
        }).catch(err => {
            logger.info(row.email + " already exist");
        });
    }
}

module.exports = {
    initAccount
};