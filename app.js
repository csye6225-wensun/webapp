const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config({ path: '/opt/.env' });

const health = require('./health');
const db = require('./models');
const auth = require('./auth');
const assignment = require('./assignment');
const statsd = require('./statsd');

// Method Not Allowed
const methodNotAllowed = (req, res, next) => res.status(405).send();

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const method = req.method;
    let url = req.originalUrl;
    const urlArray = url.split("/");
    if (urlArray.length === 4 && urlArray[2] === "assignments") {
        url = `/${urlArray[1]}/${urlArray[2]}/id`
    }
    const collectApis = ["healthz", "v1"];
    if (urlArray.length > 1 && collectApis.includes(urlArray[1])) {
        statsd.countAPICalls(method, url);
    }
    next();
});

app.route(`/healthz`)
    .get(health.getHealthz)
    .all(methodNotAllowed);

app.route(`/v1/assignments/`)
    .get(auth.authentication(db), assignment.getAssignments(db))
    .post(auth.authentication(db), assignment.postAssignments(db))
    .all(methodNotAllowed);

app.route(`/v1/assignments/:id`)
    .get(auth.authentication(db), assignment.getAssignmentByid(db))
    .delete(auth.authentication(db), assignment.delAssignmentByid(db))
    .put(auth.authentication(db), assignment.putAssignmentByid(db))
    .all(methodNotAllowed);

app.route(`/v1/assignments/:id/submission`)
    .post(auth.authentication(db), assignment.postSubmissions(db))
    .all(methodNotAllowed);

module.exports = { app, db, statsd }