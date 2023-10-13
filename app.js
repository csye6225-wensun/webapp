const express = require('express');
const bodyParser = require('body-parser');

const health = require('./health');
const db = require('./models');
const auth = require('./auth');
const assignment = require('./assignment');

// Method Not Allowed
const methodNotAllowed = (req, res, next) => res.status(405).send();

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

app.route(`/healthz`)
    .get(health.getHealthz)
    .all(methodNotAllowed);

app.route(`/v1/assignments/`)
    .get(auth.authentication(db), assignment.getAssignments(db))
    .post(auth.authentication(db), assignment.postAssignments(db))
    .delete(auth.authentication(db), assignment.delAssignmentByid(db))
    .put(auth.authentication(db), assignment.putAssignmentByid(db))
    .all(methodNotAllowed);

app.init = async () => {

};

module.exports = { app, db }