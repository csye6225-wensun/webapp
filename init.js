const mysql = require('mysql');
const fs = require("fs");
const csv = require('csv-parser');
const bcrypt = require("bcrypt");
const getStream = require('get-stream');

const saltRounds = 10;

async function initDatabase() {
    const con = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root"
    });

    await con.query("CREATE DATABASE assignment", function (err, result) {
        if (err) {
            console.log("Database existed!");
            return;
        };
        console.log("Database created!");
    });
    await con.end();
}

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
            console.log(row.email + " already exist");
        });
    }
}

module.exports = {
    initDatabase,
    initAccount
};