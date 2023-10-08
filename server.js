const express = require('express');
const health = require('./health');
const init = require('./init');
const db = require('./models');
const auth = require('./auth');
const assignment = require('./assignment');

// Method Not Allowed
const methodNotAllowed = (req, res, next) => res.status(405).send();

const app = express();
init.initDatabase();

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
        init.initAccount(db);
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.route(`/healthz`)
    .get(health.getHealthz)
    .all(methodNotAllowed);

app.route(`/v1/assignments/:id?`)
    .get(auth.authentication(db), assignment.getAssignments(db))
    .post(auth.authentication(db), assignment.postAssignments(db))
    .delete(auth.authentication(db), assignment.delAssignmentByid(db))
    .put(auth.authentication(db), assignment.putAssignmentByid(db))
    .all(methodNotAllowed);

app.listen(8080, () => console.log('App is listening on port 8080.'));