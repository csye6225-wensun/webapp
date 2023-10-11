const mysql = require('mysql');
const fs = require("fs");
const csv = require('csv-parser');
const bcrypt = require("bcrypt");

const saltRounds = 10;

function initDatabase() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "r"
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("CREATE DATABASE assignment", function (err, result) {
            if (err) {
                console.log("Database existed!");
                return;
            };
            console.log("Database created!");
        });
    });
}

function initAccount(db) {
    console.log(db.accounts);
    fs.createReadStream('./opt/users.csv')
        .pipe(csv())
        .on('data', (row) => {
            const d = new Date();
            bcrypt.hash(row.password, saltRounds, (err, hash) => {
                db.accounts.create({
                    first_name: row.first_name,
                    last_name: row.last_name,
                    password: hash,
                    email: row.email,
                    account_created: d.toString(),
                    account_updated: d.toString()
                }).catch(err => {
                    console.log(row.email + " already exist");
                });
            });

        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
}

module.exports = {
    initDatabase,
    initAccount
};